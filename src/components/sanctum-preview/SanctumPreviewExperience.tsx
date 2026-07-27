"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { createDemonstrationMember } from "@/data/preview/demo-member";
import { usePreviewExperience } from "@/hooks/usePreviewExperience";

import { PreviewCompletion } from "./PreviewCompletion";
import { PreviewEntry } from "./PreviewEntry";
import { PreviewIntroduction } from "./PreviewIntroduction";
import { PreviewShell } from "./PreviewShell";
import { DiscoveryBoundary } from "./shared/DiscoveryBoundary";

const ConnectedManSystem = dynamic(
  () =>
    import(
      "./discoveries/connected-man/ConnectedManSystem"
    ).then((module) => module.ConnectedManSystem),
  {
    loading: () => (
      <div className="discovery-loading" role="status">
        <i />
        <span>Atlas is opening the demonstration chamber…</span>
      </div>
    ),
  },
);

const REQUIRED_MEANINGFUL_INTERACTIONS = 6;

export function SanctumPreviewExperience({
  firstName,
  fullName,
  memberNumber,
  memberType,
  onReturnToInvitation,
}: {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
  onReturnToInvitation: () => void;
}) {
  const experience = usePreviewExperience({ firstName, memberNumber });
  const { state } = experience;
  const returnRequestedRef = useRef(false);
  const member = createDemonstrationMember({
    firstName,
    fullName,
    memberNumber,
    memberType,
  });
  const enoughExploration =
    state.meaningfulInteractionIds.length >=
    REQUIRED_MEANINGFUL_INTERACTIONS;

  useEffect(() => {
    if (state.stage !== "complete" || !returnRequestedRef.current) return;
    returnRequestedRef.current = false;
    onReturnToInvitation();
  }, [onReturnToInvitation, state.stage]);

  let actionLabel = "Begin the demonstration";
  let actionHint = "Atlas-guided · captions active";
  let actionDisabled = false;
  let onAction = () => {
    void import("./discoveries/connected-man/ConnectedManSystem");
    experience.beginDemonstration();
  };

  if (state.stage === "introduction") {
    actionLabel = "Reveal the connected man";
    actionHint = "One guided demonstration · approximately 90 seconds";
    onAction = experience.startConnectedMan;
  } else if (state.stage === "guided-vitality") {
    actionLabel = "Touch Vitality";
    actionHint = "Atlas has selected the first domain";
    actionDisabled = true;
  } else if (state.stage === "vitality-insight") {
    actionLabel = "Notice what changes";
    actionHint = "Sleep → Recovery → Daily Protocol";
    onAction = experience.continueToLegacy;
  } else if (state.stage === "guided-legacy") {
    actionLabel = "Touch Legacy";
    actionHint = "Atlas is extending the model";
    actionDisabled = true;
  } else if (state.stage === "legacy-insight") {
    actionLabel = "Explore the system";
    actionHint = "The guided sequence is complete";
    onAction = experience.beginFreeExploration;
  } else if (state.stage === "free-exploration") {
    actionLabel = enoughExploration
      ? "Continue the demonstration"
      : "Keep exploring";
    actionHint = enoughExploration
      ? "Atlas is ready to close the chamber"
      : `${state.meaningfulInteractionIds.length} of ${REQUIRED_MEANINGFUL_INTERACTIONS} meaningful interactions`;
    actionDisabled = !enoughExploration;
    onAction = experience.beginClosing;
  } else if (state.stage === "closing") {
    actionLabel = "Return to your invitation";
    actionHint = "Your discoveries will remain available this session";
    onAction = () => {
      returnRequestedRef.current = true;
      experience.completeDemonstration();
    };
  } else if (state.stage === "complete") {
    actionLabel = "Return to your invitation";
    actionHint = "The Atlas Demonstration is complete";
    onAction = onReturnToInvitation;
  }

  const showConnectedMan = [
    "guided-vitality",
    "vitality-insight",
    "guided-legacy",
    "legacy-insight",
    "free-exploration",
  ].includes(state.stage);
  const sceneKey = showConnectedMan ? "connected-man" : state.stage;

  return (
    <PreviewShell
      firstName={firstName}
      memberNumber={memberNumber}
      stage={state.stage}
      interactionCount={state.meaningfulInteractionIds.length}
      relationshipCount={state.revealedRelationshipIds.length}
      caption={experience.caption}
      captionRevision={state.captionRevision}
      captionsEnabled={state.captionsEnabled}
      reducedMotion={state.reducedMotion}
      actionLabel={actionLabel}
      actionHint={actionHint}
      actionDisabled={actionDisabled}
      onAction={onAction}
      onReplayCaption={experience.replayCaption}
      onToggleCaptions={experience.toggleCaptions}
    >
      <DiscoveryBoundary onReturn={experience.restartDemonstration}>
        <AnimatePresence mode="wait">
          <motion.div
            className="preview-stage__scene"
            key={sceneKey}
            initial={
              state.reducedMotion ? false : { opacity: 0, y: 14, scale: 0.995 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              state.reducedMotion
                ? undefined
                : { opacity: 0, y: -10, scale: 1.004 }
            }
            transition={{ duration: state.reducedMotion ? 0 : 0.52 }}
          >
            {state.stage === "entry" ? (
              <PreviewEntry
                firstName={firstName}
                reducedMotion={state.reducedMotion}
              />
            ) : state.stage === "introduction" ? (
              <PreviewIntroduction reducedMotion={state.reducedMotion} />
            ) : state.stage === "closing" || state.stage === "complete" ? (
              <PreviewCompletion
                firstName={firstName}
                completed={state.stage === "complete"}
                reducedMotion={state.reducedMotion}
                onReopen={experience.reopenDemonstration}
              />
            ) : (
              <ConnectedManSystem
                member={member}
                stage={state.stage}
                activePillarId={state.activePillarId}
                activeCapabilityId={state.activeCapabilityId}
                activeRelationshipId={state.activeRelationshipId}
                revealedRelationshipIds={state.revealedRelationshipIds}
                meaningfulInteractionCount={
                  state.meaningfulInteractionIds.length
                }
                reducedMotion={state.reducedMotion}
                onSelectPillar={experience.activatePillar}
                onSelectCapability={experience.activateCapability}
                onSelectRelationship={experience.activateRelationship}
                onResetView={experience.resetConnectedManView}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </DiscoveryBoundary>
    </PreviewShell>
  );
}
