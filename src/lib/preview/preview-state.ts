import type {
  AtlasDemonstrationAction,
  AtlasDemonstrationState,
} from "./preview-types";

export const INITIAL_ATLAS_CAPTION_ID = "demonstration-entry";

export function createInitialDemonstrationState(): AtlasDemonstrationState {
  return {
    stage: "entry",
    activePillarId: null,
    activeCapabilityId: null,
    activeRelationshipId: null,
    revealedRelationshipIds: [],
    meaningfulInteractionIds: [],
    adaptiveInteractionIds: [],
    analysisStageIndex: 0,
    selectedOpportunityId: null,
    activeReasoningStepId: null,
    inspectedReasoningStepIds: [],
    scenarioId: "high-demand",
    comparisonMode: "adapted",
    sleepAdjustmentMinutes: 0,
    atlasCaptionId: INITIAL_ATLAS_CAPTION_ID,
    captionRevision: 0,
    captionsEnabled: true,
    narrationEnabled: false,
    narrationMuted: true,
    reducedMotion: false,
    completed: false,
    hydrated: false,
  };
}

function appendUnique(current: string[], additions: string[]) {
  return Array.from(new Set([...current, ...additions]));
}

export function demonstrationReducer(
  state: AtlasDemonstrationState,
  action: AtlasDemonstrationAction,
): AtlasDemonstrationState {
  switch (action.type) {
    case "BEGIN_DEMONSTRATION":
      return {
        ...state,
        stage: "introduction",
        atlasCaptionId: "demonstration-introduction",
      };
    case "START_CONNECTED_MAN":
      return {
        ...state,
        stage: "guided-vitality",
        activePillarId: null,
        activeCapabilityId: null,
        activeRelationshipId: null,
        atlasCaptionId: "guided-vitality",
      };
    case "REVEAL_RELATIONSHIP":
      return {
        ...state,
        stage: action.nextStage ?? state.stage,
        activePillarId: action.pillarId,
        activeCapabilityId: action.capabilityId ?? null,
        activeRelationshipId: action.relationshipId,
        revealedRelationshipIds: appendUnique(state.revealedRelationshipIds, [
          action.relationshipId,
        ]),
        meaningfulInteractionIds: appendUnique(
          state.meaningfulInteractionIds,
          action.interactionIds,
        ),
        atlasCaptionId: action.captionId,
      };
    case "CONTINUE_TO_LEGACY":
      return {
        ...state,
        stage: "guided-legacy",
        activeCapabilityId: null,
        atlasCaptionId: "guided-legacy",
      };
    case "BEGIN_FREE_EXPLORATION":
      return {
        ...state,
        stage: "free-exploration",
        activePillarId: null,
        activeCapabilityId: null,
        activeRelationshipId: null,
        atlasCaptionId: "free-exploration",
      };
    case "BEGIN_CLOSING":
      return {
        ...state,
        stage: "closing",
        activePillarId: null,
        activeCapabilityId: null,
        activeRelationshipId: null,
        atlasCaptionId: "demonstration-closing",
      };
    case "START_ADAPTIVE_INTELLIGENCE":
      return {
        ...state,
        stage: "adaptive-transition",
        atlasCaptionId: "adaptive-transition",
      };
    case "BEGIN_ADAPTIVE_ANALYSIS":
      return {
        ...state,
        stage: "adaptive-analysis",
        analysisStageIndex: 0,
        atlasCaptionId: "adaptive-analysis-0",
      };
    case "ADVANCE_ADAPTIVE_ANALYSIS": {
      if (state.analysisStageIndex < 3) {
        const nextIndex = state.analysisStageIndex + 1;
        return {
          ...state,
          analysisStageIndex: nextIndex,
          adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
            `analysis:${state.analysisStageIndex}`,
          ]),
          atlasCaptionId: `adaptive-analysis-${nextIndex}`,
        };
      }
      return {
        ...state,
        stage: "adaptive-opportunities",
        adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
          "analysis:3",
        ]),
        atlasCaptionId: "adaptive-opportunities",
      };
    }
    case "SELECT_ADAPTIVE_OPPORTUNITY":
      return {
        ...state,
        selectedOpportunityId: action.opportunityId,
        adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
          `opportunity:${action.opportunityId}`,
        ]),
        atlasCaptionId: `adaptive-opportunity:${action.opportunityId}`,
      };
    case "BEGIN_ADAPTIVE_REASONING":
      return {
        ...state,
        stage: "adaptive-reasoning",
        activeReasoningStepId: "shorter-sleep",
        inspectedReasoningStepIds: appendUnique(
          state.inspectedReasoningStepIds,
          ["shorter-sleep"],
        ),
        atlasCaptionId: "adaptive-reasoning",
      };
    case "INSPECT_REASONING_STEP":
      return {
        ...state,
        activeReasoningStepId: action.stepId,
        inspectedReasoningStepIds: appendUnique(
          state.inspectedReasoningStepIds,
          [action.stepId],
        ),
        adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
          `reasoning:${action.stepId}`,
        ]),
        atlasCaptionId: `adaptive-reasoning:${action.stepId}`,
      };
    case "BEGIN_SCENARIO_CONTROL":
      return {
        ...state,
        stage: "adaptive-scenarios",
        atlasCaptionId: "adaptive-scenarios",
      };
    case "SELECT_ADAPTIVE_SCENARIO":
      return {
        ...state,
        scenarioId: action.scenarioId,
        comparisonMode: "adapted",
        adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
          `scenario:${action.scenarioId}`,
        ]),
        atlasCaptionId: `adaptive-scenario:${action.scenarioId}`,
      };
    case "BEGIN_ADAPTIVE_PROTOCOL":
      return {
        ...state,
        stage: "adaptive-protocol",
        comparisonMode: "adapted",
        atlasCaptionId: "adaptive-protocol",
      };
    case "SET_PROTOCOL_COMPARISON":
      return {
        ...state,
        comparisonMode: action.mode,
        adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
          `comparison:${action.mode}`,
        ]),
        atlasCaptionId: `adaptive-comparison:${action.mode}`,
      };
    case "BEGIN_ADAPTIVE_WHAT_IF":
      return {
        ...state,
        stage: "adaptive-what-if",
        sleepAdjustmentMinutes: 0,
        atlasCaptionId: "adaptive-what-if",
      };
    case "SET_SLEEP_ADJUSTMENT":
      return {
        ...state,
        sleepAdjustmentMinutes: action.minutes,
        adaptiveInteractionIds: appendUnique(state.adaptiveInteractionIds, [
          `model:${action.minutes}`,
        ]),
        atlasCaptionId:
          action.minutes === 45
            ? "adaptive-what-if-complete"
            : "adaptive-what-if",
      };
    case "BEGIN_ADAPTIVE_CLOSING":
      return {
        ...state,
        stage: "adaptive-closing",
        atlasCaptionId: "adaptive-closing",
      };
    case "COMPLETE_DEMONSTRATION":
      return {
        ...state,
        stage: "complete",
        atlasCaptionId: "demonstration-complete",
        completed: true,
      };
    case "REOPEN_DEMONSTRATION":
      return {
        ...state,
        stage: "adaptive-scenarios",
        atlasCaptionId: "adaptive-reopened",
      };
    case "RESTART_DEMONSTRATION":
      return {
        ...createInitialDemonstrationState(),
        reducedMotion: state.reducedMotion,
        captionsEnabled: state.captionsEnabled,
        hydrated: true,
      };
    case "RESET_CONNECTED_MAN_VIEW":
      return {
        ...state,
        activePillarId: null,
        activeCapabilityId: null,
        activeRelationshipId: null,
      };
    case "HYDRATE_DEMONSTRATION":
      return action.persisted
        ? {
            ...state,
            ...action.persisted,
            reducedMotion: state.reducedMotion,
            hydrated: true,
          }
        : { ...state, hydrated: true };
    case "TOGGLE_CAPTIONS":
      return { ...state, captionsEnabled: !state.captionsEnabled };
    case "REPLAY_CAPTION":
      return { ...state, captionRevision: state.captionRevision + 1 };
    case "SET_REDUCED_MOTION":
      return { ...state, reducedMotion: action.reducedMotion };
  }
}
