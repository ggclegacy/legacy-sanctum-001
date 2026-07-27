"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useReducedMotion } from "framer-motion";

import { getAtlasCaption, previewDiscoveries } from "@/data/preview/discoveries";
import { emitPreviewEvent } from "@/lib/preview/preview-events";
import {
  createInitialPreviewState,
  previewReducer,
} from "@/lib/preview/preview-state";

export function usePreviewExperience() {
  const systemReducedMotion = useReducedMotion();
  const [state, dispatch] = useReducer(
    previewReducer,
    previewDiscoveries,
    createInitialPreviewState,
  );

  useEffect(() => {
    dispatch({
      type: "SET_REDUCED_MOTION",
      reducedMotion: Boolean(systemReducedMotion),
    });
  }, [systemReducedMotion]);

  const beginPreview = useCallback(() => {
    emitPreviewEvent("preview_started");
    dispatch({ type: "BEGIN_PREVIEW" });
  }, []);

  const activateDiscovery = useCallback((discoveryId: string) => {
    emitPreviewEvent("discovery_opened", { discoveryId });
    dispatch({ type: "ACTIVATE_DISCOVERY", discoveryId });
  }, []);

  const interactWithNode = useCallback(
    (
      discoveryId: string,
      nodeId: string,
      insightId: string,
      captionId: string,
    ) => {
      emitPreviewEvent("interaction_completed", {
        discoveryId,
        interactionId: nodeId,
      });
      emitPreviewEvent("insight_revealed", {
        discoveryId,
        interactionId: insightId,
      });
      dispatch({
        type: "INTERACT_WITH_NODE",
        discoveryId,
        nodeId,
        insightId,
        captionId,
      });
    },
    [],
  );

  const completeDiscovery = useCallback((discoveryId: string) => {
    emitPreviewEvent("discovery_completed", { discoveryId });
    emitPreviewEvent("preview_completed", { discoveryId });
    dispatch({
      type: "COMPLETE_DISCOVERY",
      discoveryId,
      captionId: "digital-twin-complete",
    });
  }, []);

  const replayDiscovery = useCallback((discoveryId: string) => {
    dispatch({ type: "REPLAY_DISCOVERY", discoveryId });
  }, []);

  const restartPreview = useCallback(() => {
    dispatch({ type: "RESTART_PREVIEW" });
  }, []);

  const toggleCaptions = useCallback(() => {
    dispatch({ type: "TOGGLE_CAPTIONS" });
  }, []);

  const replayCaption = useCallback(() => {
    emitPreviewEvent("atlas_replayed", {
      discoveryId: state.activeDiscoveryId ?? undefined,
    });
    dispatch({ type: "REPLAY_CAPTION" });
  }, [state.activeDiscoveryId]);

  return {
    state,
    caption: getAtlasCaption(state.atlasCaptionId),
    discovery: previewDiscoveries[0],
    beginPreview,
    activateDiscovery,
    interactWithNode,
    completeDiscovery,
    replayDiscovery,
    restartPreview,
    toggleCaptions,
    replayCaption,
  };
}
