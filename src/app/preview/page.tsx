import { notFound } from "next/navigation";

import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { isInternalPreviewEnabled } from "@/lib/env";
import type { InvitationExperienceData } from "@/types/invitation";

const previewData: InvitationExperienceData = {
  invitationId: "internal-preview",
  firstName: "Founding Member",
  displayName: "Internal Preview",
  memberNumber: "000",
  memberType: "Founding Member",
  customHeadline: "A private entry into what comes next.",
  founderMessage:
    "This internal preview demonstrates the invitation structure. Approved recipient-specific founder copy is required before a live invitation can be published.",
  whySelected:
    "Approved selection language will recognize the recipient’s character, leadership, responsibility, and the legacy he is building. No personal facts are invented in this preview.",
  visionMessage:
    "Legacy Sanctum is becoming a private operating system built around vitality, mindset, brotherhood, and legacy.",
  foundingMemberMessage:
    "Founding-member access language remains editable until it has been approved for a live invitation.",
  closingMessage:
    "Founding members will be among the first invited to shape what Legacy Sanctum becomes.",
  products: [],
  narration: [],
};

export default function PreviewPage() {
  if (!isInternalPreviewEnabled()) notFound();
  return <InvitationExperience data={previewData} preview />;
}
