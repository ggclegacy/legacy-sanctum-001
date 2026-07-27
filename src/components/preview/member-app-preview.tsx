import { SanctumPreviewExperience } from "@/components/sanctum-preview/SanctumPreviewExperience";

export function MemberAppPreview({
  firstName,
  memberNumber,
}: {
  firstName: string;
  memberNumber: string;
}) {
  return (
    <SanctumPreviewExperience
      firstName={firstName}
      memberNumber={memberNumber}
    />
  );
}
