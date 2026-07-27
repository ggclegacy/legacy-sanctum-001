import "server-only";

import {
  createHash,
  scryptSync,
  timingSafeEqual,
  type BinaryLike,
} from "node:crypto";

export function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyPin(pin: string, encodedHash: string) {
  const [algorithm, costValue, blockSizeValue, parallelValue, salt, key] =
    encodedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !costValue ||
    !blockSizeValue ||
    !parallelValue ||
    !salt ||
    !key
  ) {
    return false;
  }

  const cost = Number(costValue);
  const blockSize = Number(blockSizeValue);
  const parallelization = Number(parallelValue);
  const expected = Buffer.from(key, "base64url");

  if (
    !Number.isSafeInteger(cost) ||
    !Number.isSafeInteger(blockSize) ||
    !Number.isSafeInteger(parallelization) ||
    cost < 2 ||
    expected.length < 32
  ) {
    return false;
  }

  try {
    const derived = scryptSync(pin as BinaryLike, salt, expected.length, {
      N: cost,
      r: blockSize,
      p: parallelization,
      maxmem: 128 * cost * blockSize * 2,
    });
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
