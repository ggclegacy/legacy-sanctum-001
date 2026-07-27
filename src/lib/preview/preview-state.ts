import type {
  DiscoveryDefinition,
  PreviewAction,
  PreviewState,
} from "./preview-types";

export const INITIAL_ATLAS_CAPTION_ID = "preview-entry";

export function createInitialPreviewState(
  discoveries: DiscoveryDefinition[],
): PreviewState {
  return {
    stage: "entry",
    activeDiscoveryId: null,
    discoveryLifecycle: Object.fromEntries(
      discoveries.map((discovery) => [discovery.id, "locked"]),
    ),
    completedDiscoveryIds: [],
    skippedDiscoveryIds: [],
    exploredNodeIds: [],
    activeNodeId: null,
    activeInsightId: null,
    atlasCaptionId: INITIAL_ATLAS_CAPTION_ID,
    captionRevision: 0,
    captionsEnabled: true,
    narrationEnabled: false,
    narrationMuted: true,
    reducedMotion: false,
    finished: false,
  };
}

export function previewReducer(
  state: PreviewState,
  action: PreviewAction,
): PreviewState {
  switch (action.type) {
    case "BEGIN_PREVIEW":
      return {
        ...state,
        stage: "atlas-introduction",
        atlasCaptionId: "digital-twin-introduction",
        discoveryLifecycle: {
          ...state.discoveryLifecycle,
          "digital-twin": "introduced",
        },
      };
    case "ACTIVATE_DISCOVERY":
      return {
        ...state,
        stage: "discovery-active",
        activeDiscoveryId: action.discoveryId,
        activeNodeId: null,
        activeInsightId: null,
        atlasCaptionId: "digital-twin-prompt",
        discoveryLifecycle: {
          ...state.discoveryLifecycle,
          [action.discoveryId]: "active",
        },
      };
    case "INTERACT_WITH_NODE": {
      const alreadyExplored = state.exploredNodeIds.includes(action.nodeId);
      return {
        ...state,
        stage: "discovery-insight",
        activeNodeId: action.nodeId,
        activeInsightId: action.insightId,
        atlasCaptionId: action.captionId,
        exploredNodeIds: alreadyExplored
          ? state.exploredNodeIds
          : [...state.exploredNodeIds, action.nodeId],
        discoveryLifecycle: {
          ...state.discoveryLifecycle,
          [action.discoveryId]: "insight-revealed",
        },
      };
    }
    case "COMPLETE_DISCOVERY":
      return {
        ...state,
        stage: "discovery-complete",
        activeNodeId: null,
        activeInsightId: null,
        atlasCaptionId: action.captionId,
        completedDiscoveryIds: state.completedDiscoveryIds.includes(
          action.discoveryId,
        )
          ? state.completedDiscoveryIds
          : [...state.completedDiscoveryIds, action.discoveryId],
        discoveryLifecycle: {
          ...state.discoveryLifecycle,
          [action.discoveryId]: "completed",
        },
        finished: true,
      };
    case "REPLAY_DISCOVERY":
      return {
        ...state,
        stage: "discovery-active",
        activeDiscoveryId: action.discoveryId,
        activeNodeId: null,
        activeInsightId: null,
        exploredNodeIds: [],
        atlasCaptionId: "digital-twin-prompt",
        discoveryLifecycle: {
          ...state.discoveryLifecycle,
          [action.discoveryId]: "active",
        },
        finished: false,
      };
    case "RESTART_PREVIEW":
      return {
        ...state,
        stage: "entry",
        activeDiscoveryId: null,
        activeNodeId: null,
        activeInsightId: null,
        exploredNodeIds: [],
        atlasCaptionId: INITIAL_ATLAS_CAPTION_ID,
        finished: false,
      };
    case "TOGGLE_CAPTIONS":
      return { ...state, captionsEnabled: !state.captionsEnabled };
    case "REPLAY_CAPTION":
      return { ...state, captionRevision: state.captionRevision + 1 };
    case "SET_REDUCED_MOTION":
      return { ...state, reducedMotion: action.reducedMotion };
  }
}
