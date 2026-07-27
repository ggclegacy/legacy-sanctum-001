import "server-only";

type RateEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateEntry>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 12;

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
