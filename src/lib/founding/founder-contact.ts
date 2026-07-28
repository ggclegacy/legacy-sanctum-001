import "server-only";

const PHONE_PATTERN = /^\+?[1-9]\d{6,14}$/;

export function getFounderPhoneNumber() {
  const configured = process.env.FOUNDER_PHONE_NUMBER?.trim();
  if (!configured) return null;

  const normalized = configured.startsWith("+")
    ? `+${configured.slice(1).replace(/\D/g, "")}`
    : configured.replace(/\D/g, "");

  return PHONE_PATTERN.test(normalized) ? normalized : null;
}
