import { SanctumPreviewExperience } from "@/components/sanctum-preview/SanctumPreviewExperience";

export function MemberAppPreview({
  firstName,
  fullName,
  memberNumber,
  memberType,
  narrationEnabled,
  onReturnToInvitation,
}: {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
  narrationEnabled: boolean;
  onReturnToInvitation: () => void;
}) {
  return (
    <SanctumPreviewExperience
      firstName={firstName}
      fullName={fullName}
      memberNumber={memberNumber}
      memberType={memberType}
      narrationEnabled={narrationEnabled}
      onReturnToInvitation={onReturnToInvitation}
    />
  );
}
