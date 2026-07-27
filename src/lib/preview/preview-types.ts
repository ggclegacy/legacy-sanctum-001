export type PreviewStage =
  | "entry"
  | "atlas-introduction"
  | "discovery-selection"
  | "discovery-active"
  | "discovery-insight"
  | "discovery-complete"
  | "final-reveal"
  | "exit";

export type DiscoveryCategory =
  | "vitality"
  | "mindset"
  | "brotherhood"
  | "legacy"
  | "atlas";

export type DiscoveryAvailability = "available" | "coming-soon";

export type DiscoveryLifecycle =
  | "locked"
  | "introduced"
  | "active"
  | "interacted"
  | "insight-revealed"
  | "completed";

export type DiscoveryDefinition = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: DiscoveryCategory;
  introductionCaption: string;
  completionCaption: string;
  estimatedSeconds: number;
  requiredInteractions: number;
  status: DiscoveryAvailability;
};

export type AtlasNarrationSegment = {
  id: string;
  discoveryId: string;
  trigger: string;
  caption: string;
  audioSrc?: string;
  durationMs?: number;
};

export type PreviewState = {
  stage: PreviewStage;
  activeDiscoveryId: string | null;
  discoveryLifecycle: Record<string, DiscoveryLifecycle>;
  completedDiscoveryIds: string[];
  skippedDiscoveryIds: string[];
  exploredNodeIds: string[];
  activeNodeId: string | null;
  activeInsightId: string | null;
  atlasCaptionId: string;
  captionRevision: number;
  captionsEnabled: boolean;
  narrationEnabled: boolean;
  narrationMuted: boolean;
  reducedMotion: boolean;
  finished: boolean;
};

export type PreviewAction =
  | { type: "BEGIN_PREVIEW" }
  | { type: "ACTIVATE_DISCOVERY"; discoveryId: string }
  | {
      type: "INTERACT_WITH_NODE";
      discoveryId: string;
      nodeId: string;
      insightId: string;
      captionId: string;
    }
  | { type: "COMPLETE_DISCOVERY"; discoveryId: string; captionId: string }
  | { type: "REPLAY_DISCOVERY"; discoveryId: string }
  | { type: "RESTART_PREVIEW" }
  | { type: "TOGGLE_CAPTIONS" }
  | { type: "REPLAY_CAPTION" }
  | { type: "SET_REDUCED_MOTION"; reducedMotion: boolean };

export type PreviewEventName =
  | "preview_started"
  | "discovery_opened"
  | "interaction_completed"
  | "insight_revealed"
  | "discovery_completed"
  | "atlas_replayed"
  | "preview_skipped"
  | "preview_completed";

export type PreviewEvent = {
  name: PreviewEventName;
  discoveryId?: string;
  interactionId?: string;
  occurredAt: string;
};
