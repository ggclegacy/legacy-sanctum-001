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
        stage: "free-exploration",
        activePillarId: null,
        activeCapabilityId: null,
        activeRelationshipId: null,
        atlasCaptionId: "free-exploration-return",
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
