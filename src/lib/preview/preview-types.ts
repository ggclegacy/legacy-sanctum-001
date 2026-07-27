export type DemonstrationStage =
  | "entry"
  | "introduction"
  | "guided-vitality"
  | "vitality-insight"
  | "guided-legacy"
  | "legacy-insight"
  | "free-exploration"
  | "closing"
  | "adaptive-transition"
  | "adaptive-analysis"
  | "adaptive-opportunities"
  | "adaptive-reasoning"
  | "adaptive-scenarios"
  | "adaptive-protocol"
  | "adaptive-what-if"
  | "adaptive-closing"
  | "complete";

export type PillarId = "vitality" | "mindset" | "brotherhood" | "legacy";
export type AdaptiveScenarioId = "standard" | "high-demand" | "travel";
export type AdaptiveOpportunityId =
  | "protect-recovery"
  | "preserve-decision-quality"
  | "adapt-training-load";
export type ProtocolComparisonMode = "original" | "adapted";

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

export type AdaptiveAnalysisDefinition = {
  id: string;
  label: string;
  caption: string;
  inputs: string[];
  output: string;
};

export type AdaptiveOpportunityDefinition = {
  id: AdaptiveOpportunityId;
  number: number;
  label: string;
  observed: string[];
  contributors: string[];
  significance: string;
  response: string[];
  atlasInsight: string;
};

export type AdaptiveReasoningStepDefinition = {
  id: string;
  label: string;
  explanation: string;
};

export type ProtocolChangeLabel =
  | "MOVED EARLIER"
  | "REDUCED"
  | "PRIORITIZED"
  | "SIMPLIFIED"
  | "ADDED"
  | "REMOVED"
  | "MAINTAINED";

export type ProtocolPeriod =
  | "MORNING"
  | "MIDDAY"
  | "PERFORMANCE WINDOW"
  | "RECOVERY WINDOW"
  | "EVENING";

export type AdaptiveProtocolItem = {
  id: string;
  period: ProtocolPeriod;
  label: string;
  detail: string;
  change: ProtocolChangeLabel;
  emphasis: "normal" | "softened" | "priority";
};

export type AdaptiveScenarioDefinition = {
  id: AdaptiveScenarioId;
  number: number;
  label: string;
  shortLabel: string;
  signals: string[];
  priority: string;
  training: string;
  hydration: string;
  recovery: string;
  explanation: string;
  originalProtocol: AdaptiveProtocolItem[];
  adaptedProtocol: AdaptiveProtocolItem[];
};

export type ScenarioModelState = {
  adjustmentMinutes: number;
  recoveryCapacity: "limited" | "protected" | "balanced";
  trainingMargin: "limited" | "protected" | "expanded";
  protocolConstraint: "prioritized" | "softened" | "balanced";
  explanation: string;
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
  adaptiveInteractionIds: string[];
  analysisStageIndex: number;
  selectedOpportunityId: AdaptiveOpportunityId | null;
  activeReasoningStepId: string | null;
  inspectedReasoningStepIds: string[];
  scenarioId: AdaptiveScenarioId;
  comparisonMode: ProtocolComparisonMode;
  sleepAdjustmentMinutes: number;
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
  | "adaptiveInteractionIds"
  | "analysisStageIndex"
  | "selectedOpportunityId"
  | "activeReasoningStepId"
  | "inspectedReasoningStepIds"
  | "scenarioId"
  | "comparisonMode"
  | "sleepAdjustmentMinutes"
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
  | { type: "START_ADAPTIVE_INTELLIGENCE" }
  | { type: "BEGIN_ADAPTIVE_ANALYSIS" }
  | { type: "ADVANCE_ADAPTIVE_ANALYSIS" }
  | {
      type: "SELECT_ADAPTIVE_OPPORTUNITY";
      opportunityId: AdaptiveOpportunityId;
    }
  | { type: "BEGIN_ADAPTIVE_REASONING" }
  | { type: "INSPECT_REASONING_STEP"; stepId: string }
  | { type: "BEGIN_SCENARIO_CONTROL" }
  | { type: "SELECT_ADAPTIVE_SCENARIO"; scenarioId: AdaptiveScenarioId }
  | { type: "BEGIN_ADAPTIVE_PROTOCOL" }
  | { type: "SET_PROTOCOL_COMPARISON"; mode: ProtocolComparisonMode }
  | { type: "BEGIN_ADAPTIVE_WHAT_IF" }
  | { type: "SET_SLEEP_ADJUSTMENT"; minutes: number }
  | { type: "BEGIN_ADAPTIVE_CLOSING" }
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
  | "adaptive_intelligence_started"
  | "adaptive_analysis_advanced"
  | "adaptive_opportunity_selected"
  | "adaptive_reasoning_inspected"
  | "adaptive_scenario_changed"
  | "adaptive_protocol_compared"
  | "adaptive_model_changed"
  | "demonstration_completed"
  | "demonstration_reopened";

export type PreviewEvent = {
  name: PreviewEventName;
  pillarId?: PillarId;
  interactionId?: string;
  scenarioId?: AdaptiveScenarioId;
  occurredAt: string;
};
