import "server-only";

type RateEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateEntry>();
const atlasVoiceAttempts = new Map<string, RateEntry>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 12;
const ATLAS_VOICE_WINDOW_MS = 60 * 1000;
const ATLAS_VOICE_MAX_ATTEMPTS = 30;

export function consumeVerificationAttempt(identifier: string) {
  const now = Date.now();
  const current = attempts.get(identifier);

  if (!current || current.resetAt <= now) {
    attempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function consumeAtlasVoiceAttempt(identifier: string) {
  const now = Date.now();
  const current = atlasVoiceAttempts.get(identifier);

  if (!current || current.resetAt <= now) {
    atlasVoiceAttempts.set(identifier, {
      count: 1,
      resetAt: now + ATLAS_VOICE_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= ATLAS_VOICE_MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
