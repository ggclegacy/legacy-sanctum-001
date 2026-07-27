export type DemonstrationStage =
  | "entry"
  | "introduction"
  | "guided-vitality"
  | "vitality-insight"
  | "guided-legacy"
  | "legacy-insight"
  | "free-exploration"
  | "closing"
  | "complete";

export type PillarId = "vitality" | "mindset" | "brotherhood" | "legacy";

export type AtlasDemonstrationMember = {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
  leadershipContext?: string;
  personalizedOpening?: string;
  personalizedClosing?: string;
};

export type CapabilityDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  relationshipId: string;
};

export type PillarDefinition = {
  id: PillarId;
  number: number;
  label: string;
  shortLabel: string;
  statement: string;
  x: number;
  y: number;
  capabilities: CapabilityDefinition[];
  defaultRelationshipId: string;
};

export type RelationshipDefinition = {
  id: string;
  anchorPillarId: PillarId;
  relatedPillarIds: PillarId[];
  title: string;
  path: string[];
  capabilityIds: string[];
  demonstration: string;
  atlasInsight: string;
  response: string;
};

export type AtlasNarrationSegment = {
  id: string;
  stage: DemonstrationStage;
  trigger: string;
  caption: string;
  audioSrc?: string;
  durationMs?: number;
  completionTrigger?: string;
};

export type AtlasDemonstrationState = {
  stage: DemonstrationStage;
  activePillarId: PillarId | null;
  activeCapabilityId: string | null;
  activeRelationshipId: string | null;
  revealedRelationshipIds: string[];
  meaningfulInteractionIds: string[];
  atlasCaptionId: string;
  captionRevision: number;
  captionsEnabled: boolean;
  narrationEnabled: boolean;
  narrationMuted: boolean;
  reducedMotion: boolean;
  completed: boolean;
  hydrated: boolean;
};

export type PersistedDemonstrationState = Pick<
  AtlasDemonstrationState,
  | "stage"
  | "activePillarId"
  | "activeCapabilityId"
  | "activeRelationshipId"
  | "revealedRelationshipIds"
  | "meaningfulInteractionIds"
  | "atlasCaptionId"
  | "captionsEnabled"
  | "completed"
>;

export type AtlasDemonstrationAction =
  | { type: "BEGIN_DEMONSTRATION" }
  | { type: "START_CONNECTED_MAN" }
  | {
      type: "REVEAL_RELATIONSHIP";
      pillarId: PillarId;
      capabilityId?: string;
      relationshipId: string;
      captionId: string;
      interactionIds: string[];
      nextStage?: DemonstrationStage;
    }
  | { type: "CONTINUE_TO_LEGACY" }
  | { type: "BEGIN_FREE_EXPLORATION" }
  | { type: "BEGIN_CLOSING" }
  | { type: "COMPLETE_DEMONSTRATION" }
  | { type: "REOPEN_DEMONSTRATION" }
  | { type: "RESTART_DEMONSTRATION" }
  | { type: "RESET_CONNECTED_MAN_VIEW" }
  | {
      type: "HYDRATE_DEMONSTRATION";
      persisted: PersistedDemonstrationState | null;
    }
  | { type: "TOGGLE_CAPTIONS" }
  | { type: "REPLAY_CAPTION" }
  | { type: "SET_REDUCED_MOTION"; reducedMotion: boolean };

export type PreviewEventName =
  | "demonstration_started"
  | "pillar_activated"
  | "capability_opened"
  | "relationship_revealed"
  | "free_exploration_started"
  | "atlas_replayed"
  | "demonstration_completed"
  | "demonstration_reopened";

export type PreviewEvent = {
  name: PreviewEventName;
  pillarId?: PillarId;
  interactionId?: string;
  occurredAt: string;
};
