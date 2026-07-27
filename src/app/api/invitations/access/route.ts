import { cookies, headers } from "next/headers";

import {
  getBuiltInAccessRecord,
  hashAccessCode,
} from "@/data/access-codes";
import {
  getInvitationExperience,
  getInviteForAccessCode,
  recordSuccessfulVerification,
} from "@/data/invitations";
import { consumeVerificationAttempt } from "@/lib/security/rate-limit";
import {
  createInviteSession,
  INVITE_SESSION_COOKIE,
} from "@/lib/security/invite-session";
import { accessCodeSchema } from "@/lib/validation";

const accessRequestSchema = accessCodeSchema.transform((accessCode) => ({
  accessCode,
}));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { accessCode?: unknown }
    | null;
  const parsed = accessRequestSchema.safeParse(body?.accessCode);

  if (!parsed.success) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const accessCodeHash = hashAccessCode(parsed.data.accessCode);
  const rate = consumeVerificationAttempt(
    `${ip}:access:${accessCodeHash.slice(0, 16)}`,
  );

  if (!rate.allowed) {
    return Response.json(
      { ok: false, reason: "locked" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  try {
    const lookup = await getInviteForAccessCode(accessCodeHash);
    const record = lookup.record;

    if (lookup.configured && record) {
      if (record.status === "locked") {
        return Response.json({ ok: false, reason: "locked" }, { status: 423 });
      }
      if (record.status === "revoked") {
        return Response.json({ ok: false, reason: "revoked" }, { status: 410 });
      }
      if (
        record.status === "expired" ||
        (record.expiresAt && new Date(record.expiresAt).getTime() <= Date.now())
      ) {
        return Response.json({ ok: false, reason: "expired" }, { status: 410 });
      }
      if (!["ready", "sent", "opened", "verified"].includes(record.status)) {
        return Response.json(
          { ok: false, reason: "unavailable" },
          { status: 403 },
        );
      }

      const invitation = await getInvitationExperience(record);
      const session = createInviteSession(record.id);
      await recordSuccessfulVerification(record.id);

      if (session) {
        const cookieStore = await cookies();
        cookieStore.set(INVITE_SESSION_COOKIE, session.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: session.maxAge,
        });
      }

      return Response.json(
        {
          ok: true,
          invitation,
          preview: false,
          trackingEnabled: Boolean(session),
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  } catch {
    // Built-in launch records keep the first preview usable while the
    // production Supabase migration and member records are being connected.
  }

  const builtInRecord = getBuiltInAccessRecord(accessCodeHash);
  if (!builtInRecord) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 401 });
  }

  return Response.json(
    {
      ok: true,
      invitation: builtInRecord.invitation,
      preview: builtInRecord.preview,
      trackingEnabled: false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
