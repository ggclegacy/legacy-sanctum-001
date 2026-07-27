import { createHash, randomBytes, randomInt, scryptSync } from "node:crypto";

const token = randomBytes(24).toString("base64url");
const pin = String(randomInt(0, 1_000_000)).padStart(6, "0");
const salt = randomBytes(18).toString("base64url");
const cost = 16384;
const blockSize = 8;
const parallelization = 1;
const key = scryptSync(pin, salt, 64, {
  N: cost,
  r: blockSize,
  p: parallelization,
  maxmem: 128 * cost * blockSize * 2,
}).toString("base64url");

const output = {
  invitationUrlToken: token,
  printedPin: pin,
  publicTokenHash: createHash("sha256").update(token).digest("hex"),
  pinHash: `scrypt$${cost}$${blockSize}$${parallelization}$${salt}$${key}`,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
