export type PreviewMember = {
  firstName: string;
  memberNumber: string;
  modelLabel: string;
  dataLabel: string;
};

export function createPreviewMember(
  firstName: string,
  memberNumber: string,
): PreviewMember {
  return {
    firstName,
    memberNumber,
    modelLabel: `${firstName}'s evolving model`,
    dataLabel: "Simulated member intelligence",
  };
}
