import { cookies } from "next/headers";

import { saveInvitationResponse } from "@/data/responses";
import {
  INVITE_SESSION_COOKIE,
  verifyInviteSession,
} from "@/lib/security/invite-session";
import { responseSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = responseSchema.safeParse(await request.json());
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
    const saved = await saveInvitationResponse(session.inviteId, parsed.data);
    if (!saved) return Response.json({ ok: false }, { status: 503 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
