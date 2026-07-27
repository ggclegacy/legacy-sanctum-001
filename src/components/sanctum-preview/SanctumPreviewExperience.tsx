"use client";

import { ContinuousAtlasTour } from "./tour/ContinuousAtlasTour";

export function SanctumPreviewExperience({
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
    <ContinuousAtlasTour
      firstName={firstName}
      fullName={fullName}
      memberNumber={memberNumber}
      memberType={memberType}
      narrationEnabled={narrationEnabled}
      onReturnToInvitation={onReturnToInvitation}
    />
  );
}
