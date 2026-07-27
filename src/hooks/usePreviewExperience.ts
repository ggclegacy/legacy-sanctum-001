"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useReducedMotion } from "framer-motion";

import {
  getRelationship,
  getCapability,
  getPillar,
} from "@/data/preview/connected-man";
import { getAtlasCaption } from "@/data/preview/discoveries";
import { emitPreviewEvent } from "@/lib/preview/preview-events";
import {
  createInitialDemonstrationState,
  demonstrationReducer,
} from "@/lib/preview/preview-state";
import type {
  DemonstrationStage,
  PersistedDemonstrationState,
  PillarId,
} from "@/lib/preview/preview-types";

const demonstrationStages = new Set<DemonstrationStage>([
  "entry",
  "introduction",
  "guided-vitality",
  "vitality-insight",
  "guided-legacy",
  "legacy-insight",
  "free-exploration",
  "closing",
  "complete",
]);

function readPersistedState(storageKey: string) {
  try {
    const value = window.sessionStorage.getItem(storageKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as PersistedDemonstrationState;
    if (
      !demonstrationStages.has(parsed.stage) ||
      !Array.isArray(parsed.revealedRelationshipIds) ||
      !Array.isArray(parsed.meaningfulInteractionIds)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function usePreviewExperience({
  firstName,
  memberNumber,
}: {
  firstName: string;
  memberNumber: string;
}) {
  const systemReducedMotion = useReducedMotion();
  const storageKey = `legacy-sanctum:atlas-demonstration:${memberNumber}`;
  const [state, dispatch] = useReducer(
    demonstrationReducer,
    undefined,
    createInitialDemonstrationState,
  );

  useEffect(() => {
    dispatch({
      type: "SET_REDUCED_MOTION",
      reducedMotion: Boolean(systemReducedMotion),
    });
  }, [systemReducedMotion]);

  useEffect(() => {
    dispatch({
      type: "HYDRATE_DEMONSTRATION",
      persisted: readPersistedState(storageKey),
    });
  }, [storageKey]);

  useEffect(() => {
    if (!state.hydrated) return;
    const persisted: PersistedDemonstrationState = {
      stage: state.stage,
      activePillarId: state.activePillarId,
      activeCapabilityId: state.activeCapabilityId,
      activeRelationshipId: state.activeRelationshipId,
      revealedRelationshipIds: state.revealedRelationshipIds,
      meaningfulInteractionIds: state.meaningfulInteractionIds,
      atlasCaptionId: state.atlasCaptionId,
      captionsEnabled: state.captionsEnabled,
      completed: state.completed,
    };
    window.sessionStorage.setItem(storageKey, JSON.stringify(persisted));
  }, [state, storageKey]);

  const beginDemonstration = useCallback(() => {
    emitPreviewEvent("demonstration_started");
    dispatch({ type: "BEGIN_DEMONSTRATION" });
  }, []);

  const startConnectedMan = useCallback(() => {
    dispatch({ type: "START_CONNECTED_MAN" });
  }, []);

  const activatePillar = useCallback(
    (pillarId: PillarId) => {
      const pillar = getPillar(pillarId);
      if (!pillar) return;

      let relationshipId = pillar.defaultRelationshipId;
      let captionId = `relationship:${relationshipId}`;
      let nextStage: DemonstrationStage | undefined;

      if (state.stage === "guided-vitality" && pillarId === "vitality") {
        relationshipId = "sleep-recovery-protocol";
        captionId = "vitality-insight";
        nextStage = "vitality-insight";
      } else if (state.stage === "guided-legacy" && pillarId === "legacy") {
        relationshipId = "vitality-leadership";
        captionId = "legacy-insight";
        nextStage = "legacy-insight";
      }

      emitPreviewEvent("pillar_activated", {
        pillarId,
        interactionId: pillarId,
      });
      emitPreviewEvent("relationship_revealed", {
        pillarId,
        interactionId: relationshipId,
      });
      dispatch({
        type: "REVEAL_RELATIONSHIP",
        pillarId,
        relationshipId,
        captionId,
        interactionIds: [
          `pillar:${pillarId}`,
          `relationship:${relationshipId}`,
        ],
        nextStage,
      });
    },
    [state.stage],
  );

  const activateCapability = useCallback((capabilityId: string) => {
    const match = getCapability(capabilityId);
    if (!match) return;
    const { capability, pillar } = match;

    emitPreviewEvent("capability_opened", {
      pillarId: pillar.id,
      interactionId: capability.id,
    });
    emitPreviewEvent("relationship_revealed", {
      pillarId: pillar.id,
      interactionId: capability.relationshipId,
    });
    dispatch({
      type: "REVEAL_RELATIONSHIP",
      pillarId: pillar.id,
      capabilityId: capability.id,
      relationshipId: capability.relationshipId,
      captionId: `relationship:${capability.relationshipId}`,
      interactionIds: [
        `capability:${capability.id}`,
        `relationship:${capability.relationshipId}`,
      ],
    });
  }, []);

  const activateRelationship = useCallback((relationshipId: string) => {
    const relationship = getRelationship(relationshipId);
    if (!relationship) return;
    emitPreviewEvent("relationship_revealed", {
      pillarId: relationship.anchorPillarId,
      interactionId: relationship.id,
    });
    dispatch({
      type: "REVEAL_RELATIONSHIP",
      pillarId: relationship.anchorPillarId,
      relationshipId: relationship.id,
      captionId: `relationship:${relationship.id}`,
      interactionIds: [`relationship:${relationship.id}`],
    });
  }, []);

  const continueToLegacy = useCallback(() => {
    dispatch({ type: "CONTINUE_TO_LEGACY" });
  }, []);

  const beginFreeExploration = useCallback(() => {
    emitPreviewEvent("free_exploration_started");
    dispatch({ type: "BEGIN_FREE_EXPLORATION" });
  }, []);

  const beginClosing = useCallback(() => {
    dispatch({ type: "BEGIN_CLOSING" });
  }, []);

  const completeDemonstration = useCallback(() => {
    emitPreviewEvent("demonstration_completed");
    dispatch({ type: "COMPLETE_DEMONSTRATION" });
  }, []);

  const reopenDemonstration = useCallback(() => {
    emitPreviewEvent("demonstration_reopened");
    dispatch({ type: "REOPEN_DEMONSTRATION" });
  }, []);

  const restartDemonstration = useCallback(() => {
    dispatch({ type: "RESTART_DEMONSTRATION" });
  }, []);

  const resetConnectedManView = useCallback(() => {
    dispatch({ type: "RESET_CONNECTED_MAN_VIEW" });
  }, []);

  const toggleCaptions = useCallback(() => {
    dispatch({ type: "TOGGLE_CAPTIONS" });
  }, []);

  const replayCaption = useCallback(() => {
    emitPreviewEvent("atlas_replayed", {
      pillarId: state.activePillarId ?? undefined,
    });
    dispatch({ type: "REPLAY_CAPTION" });
  }, [state.activePillarId]);

  const caption = useMemo(
    () => getAtlasCaption(state.atlasCaptionId, firstName),
    [firstName, state.atlasCaptionId],
  );

  return {
    state,
    caption,
    beginDemonstration,
    startConnectedMan,
    activatePillar,
    activateCapability,
    activateRelationship,
    continueToLegacy,
    beginFreeExploration,
    beginClosing,
    completeDemonstration,
    reopenDemonstration,
    restartDemonstration,
    resetConnectedManView,
    toggleCaptions,
    replayCaption,
  };
}
