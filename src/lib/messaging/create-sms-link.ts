export type SmsPlatform = "ios" | "android" | "other";

export type CreateSmsLinkInput = {
  phoneNumber: string;
  message: string;
  platform: SmsPlatform;
};

const PHONE_PATTERN = /^\+?[1-9]\d{6,14}$/;

export function normalizeSmsPhoneNumber(phoneNumber: string) {
  const trimmed = phoneNumber.trim();
  const normalized = trimmed.startsWith("+")
    ? `+${trimmed.slice(1).replace(/\D/g, "")}`
    : trimmed.replace(/\D/g, "");

  return PHONE_PATTERN.test(normalized) ? normalized : null;
}

export function detectSmsPlatform(userAgent: string): SmsPlatform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "other";
}

export function createSmsLink({
  phoneNumber,
  message,
  platform,
}: CreateSmsLinkInput) {
  const normalizedPhoneNumber = normalizeSmsPhoneNumber(phoneNumber);
  const normalizedMessage = message.trim();

  if (!normalizedPhoneNumber || !normalizedMessage) return null;

  const separator = platform === "ios" ? "&" : "?";
  return `sms:${normalizedPhoneNumber}${separator}body=${encodeURIComponent(normalizedMessage)}`;
}
