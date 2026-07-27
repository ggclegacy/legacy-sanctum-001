import { cookies } from "next/headers";

import { saveInvitationEvent } from "@/data/events";
import {
  INVITE_SESSION_COOKIE,
  verifyInviteSession,
} from "@/lib/security/invite-session";
import { eventSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const cookieStore = await cookies();
  const session = verifyInviteSession(
    cookieStore.get(INVITE_SESSION_COOKIE)?.value,
  );
  if (!session) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    const saved = await saveInvitationEvent(
      session.inviteId,
      parsed.data.eventType,
      parsed.data.sceneKey ?? null,
    );
    if (!saved) return Response.json({ ok: false }, { status: 503 });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
