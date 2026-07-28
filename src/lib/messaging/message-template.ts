export type MessageTemplateValues = {
  firstName: string;
  fullName: string;
  memberNumber: string;
};

const SUPPORTED_TOKENS = [
  "firstName",
  "fullName",
  "memberNumber",
] as const;

export function renderMessageTemplate(
  template: string,
  values: MessageTemplateValues,
) {
  return SUPPORTED_TOKENS.reduce(
    (message, token) =>
      message.replaceAll(`{{${token}}}`, values[token].trim()),
    template,
  );
}
