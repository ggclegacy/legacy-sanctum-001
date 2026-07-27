import { SanctumPreviewExperience } from "@/components/sanctum-preview/SanctumPreviewExperience";

export function MemberAppPreview({
  firstName,
  fullName,
  memberNumber,
  memberType,
  onReturnToInvitation,
}: {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
  onReturnToInvitation: () => void;
}) {
  return (
    <SanctumPreviewExperience
      firstName={firstName}
      fullName={fullName}
      memberNumber={memberNumber}
      memberType={memberType}
      onReturnToInvitation={onReturnToInvitation}
    />
  );
}
