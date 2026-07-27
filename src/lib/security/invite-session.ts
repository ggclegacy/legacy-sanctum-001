import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { getServerEnv } from "@/lib/env";

export const INVITE_SESSION_COOKIE = "ls_invite_session";
const SESSION_DURATION_SECONDS = 60 * 60;

type InviteSessionPayload = {
  inviteId: string;
  exp: number;
};

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createInviteSession(inviteId: string) {
  const env = getServerEnv();
  if (!env) return null;

  const payload: InviteSessionPayload = {
    inviteId,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  const signature = sign(encodedPayload, env.INVITE_SESSION_SECRET);

  return {
    value: `${encodedPayload}.${signature}`,
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function verifyInviteSession(value: string | undefined) {
  const env = getServerEnv();
  if (!env || !value) return null;

  const [encodedPayload, receivedSignature] = value.split(".");
  if (!encodedPayload || !receivedSignature) return null;

  const expectedSignature = sign(
    encodedPayload,
    env.INVITE_SESSION_SECRET,
  );
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(receivedSignature);

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as InviteSessionPayload;
    if (
      typeof payload.inviteId !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
