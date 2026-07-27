import { cookies, headers } from "next/headers";

import {
  getInvitationExperience,
  getInviteForVerification,
  recordFailedAttempt,
  recordSuccessfulVerification,
} from "@/data/invitations";
import { hashInviteToken, verifyPin } from "@/lib/security/invite-crypto";
import {
  createInviteSession,
  INVITE_SESSION_COOKIE,
} from "@/lib/security/invite-session";
import { consumeVerificationAttempt } from "@/lib/security/rate-limit";
import { verifyInviteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = verifyInviteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const tokenHash = hashInviteToken(parsed.data.token);
  const rate = consumeVerificationAttempt(`${ip}:${tokenHash.slice(0, 16)}`);

  if (!rate.allowed) {
    return Response.json(
      { ok: false, reason: "unavailable" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  try {
    const lookup = await getInviteForVerification(tokenHash);
    if (!lookup.configured) {
      return Response.json(
        { ok: false, reason: "unavailable" },
        { status: 503 },
      );
    }

    const record = lookup.record;
    if (!record) {
      return Response.json({ ok: false, reason: "invalid" }, { status: 401 });
    }

    const pinMatches = verifyPin(parsed.data.pin, record.pinHash);
    if (!pinMatches) {
      await recordFailedAttempt(record);
      return Response.json({ ok: false, reason: "invalid" }, { status: 401 });
    }

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

    const session = createInviteSession(record.id);
    if (!session) {
      return Response.json(
        { ok: false, reason: "unavailable" },
        { status: 503 },
      );
    }

    const invitation = await getInvitationExperience(record);
    await recordSuccessfulVerification(record.id);

    const cookieStore = await cookies();
    cookieStore.set(INVITE_SESSION_COOKIE, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: session.maxAge,
    });

    return Response.json(
      { ok: true, invitation },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { ok: false, reason: "unavailable" },
      { status: 503 },
    );
  }
}
