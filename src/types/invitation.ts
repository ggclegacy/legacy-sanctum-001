export const SCENE_KEYS = [
  "recognition",
  "founder",
  "selection",
  "pillars",
  "products",
  "platform",
  "founding",
  "response",
  "completion",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];
export type NarrationPreference = "atlas" | "silent";

export type InvitationProduct = {
  id: string;
  name: string;
  shortPurpose: string;
  selectionReason: string;
  usageNote: string | null;
  imagePath: string | null;
  pillar?: "vitality" | "mindset" | "brotherhood" | "legacy";
};

export type NarrationSegment = {
  sceneKey: SceneKey;
  script: string;
  audioPath: string | null;
  durationMs: number | null;
};

export type InvitationExperienceData = {
  invitationId: string;
  firstName: string;
  displayName: string;
  memberNumber: string;
  memberType: string;
  customHeadline: string | null;
  founderMessage: string;
  whySelected: string;
  visionMessage: string;
  foundingMemberMessage: string;
  postDemonstrationFounderMessage?: string | null;
  founderPhoneNumber?: string | null;
  smsTemplate?: string | null;
  closingMessage: string;
  products: InvitationProduct[];
  narration: NarrationSegment[];
};

export type InviteStatus =
  | "draft"
  | "ready"
  | "sent"
  | "opened"
  | "verified"
  | "accepted"
  | "declined"
  | "completed"
  | "expired"
  | "revoked"
  | "locked";
