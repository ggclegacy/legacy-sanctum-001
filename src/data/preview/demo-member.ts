import type { AtlasDemonstrationMember } from "@/lib/preview/preview-types";

export function createDemonstrationMember({
  firstName,
  fullName,
  memberNumber,
  memberType,
}: {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
}): AtlasDemonstrationMember {
  return {
    firstName,
    fullName,
    memberNumber,
    memberType,
  };
}
