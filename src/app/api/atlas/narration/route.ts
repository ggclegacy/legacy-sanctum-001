import { z } from "zod";

import {
  ATLAS_NARRATION_MAX_CHARACTERS,
  getAtlasVoiceRuntimeConfig,
} from "@/lib/atlas/voice-config";
import { consumeAtlasVoiceAttempt } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const atlasNarrationRequestSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(1, "Narration text is required.")
      .max(
        ATLAS_NARRATION_MAX_CHARACTERS,
        `Narration text must be ${ATLAS_NARRATION_MAX_CHARACTERS} characters or fewer.`,
      ),
  })
  .strict();

type AtlasVoiceErrorCode =
  | "invalid_text"
  | "missing_api_key"
  | "missing_voice_id"
  | "rate_limited"
  | "provider_error"
  | "network_failure"
  | "empty_audio";

function errorResponse(
  status: number,
  code: AtlasVoiceErrorCode,
  message: string,
  headers?: HeadersInit,
) {
  return Response.json(
    { ok: false, code, message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = atlasNarrationRequestSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(
      400,
      "invalid_text",
      parsed.error.issues[0]?.message ?? "Narration text is invalid.",
    );
  }

  const config = getAtlasVoiceRuntimeConfig();

  if (!config.apiKey) {
    return errorResponse(
      503,
      "missing_api_key",
      "Atlas voice testing is not configured. Add the server-only ElevenLabs API key and restart the development server.",
    );
  }

  if (!config.voiceId) {
    return errorResponse(
      503,
      "missing_voice_id",
      "Atlas voice testing is missing its server-only voice ID.",
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const rate = consumeAtlasVoiceAttempt(`atlas-voice:${ip}`);

  if (!rate.allowed) {
    return errorResponse(
      429,
      "rate_limited",
      "Atlas voice testing is temporarily rate limited. Wait a moment and try again.",
      { "Retry-After": String(rate.retryAfterSeconds) },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.requestTimeoutMs,
  );

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(config.voiceId)}?output_format=${config.outputFormat}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": config.apiKey,
        },
        body: JSON.stringify({
          text: parsed.data.text,
          model_id: config.modelId,
          voice_settings: config.voiceSettings,
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return errorResponse(
          429,
          "rate_limited",
          "ElevenLabs is rate limiting voice generation. Wait and try again.",
          response.headers.get("retry-after")
            ? { "Retry-After": response.headers.get("retry-after")! }
            : undefined,
        );
      }

      return errorResponse(
        502,
        "provider_error",
        response.status === 401 || response.status === 403
          ? "ElevenLabs rejected the server credentials. Verify the local API key."
          : "ElevenLabs could not generate the Atlas narration.",
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("audio")) {
      return errorResponse(
        502,
        "provider_error",
        "ElevenLabs returned an unexpected response instead of audio.",
      );
    }

    const audio = await response.arrayBuffer();
    if (audio.byteLength === 0) {
      return errorResponse(
        502,
        "empty_audio",
        "ElevenLabs returned an empty audio response.",
      );
    }

    return new Response(audio, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Length": String(audio.byteLength),
        "Content-Type": "audio/mpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return errorResponse(
      502,
      "network_failure",
      "Atlas voice generation could not reach ElevenLabs. Check the network and try again.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
