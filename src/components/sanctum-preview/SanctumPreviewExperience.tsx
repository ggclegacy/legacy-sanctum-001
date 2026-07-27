"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { createDemonstrationMember } from "@/data/preview/demo-member";
import { useAtlasNarration } from "@/hooks/useAtlasNarration";
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

const AdaptiveIntelligenceSystem = dynamic(
  () =>
    import(
      "./discoveries/adaptive-intelligence/AdaptiveIntelligenceSystem"
    ).then((module) => module.AdaptiveIntelligenceSystem),
  {
    loading: () => (
      <div className="discovery-loading" role="status">
        <i />
        <span>Atlas is preparing the intelligence chamber…</span>
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
  narrationEnabled,
  onReturnToInvitation,
}: {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
  narrationEnabled: boolean;
  onReturnToInvitation: () => void;
}) {
  const experience = usePreviewExperience({ firstName, memberNumber });
  const {
    status: narrationStatus,
    error: narrationError,
    muted: narrationMuted,
    hasAudio: narrationHasAudio,
    speak,
    pause,
    resume,
    toggleMuted,
    stop,
  } = useAtlasNarration();
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
  const enoughReasoning = state.inspectedReasoningStepIds.length >= 3;
  const scenarioChanged = state.adaptiveInteractionIds.some(
    (interactionId) =>
      interactionId === "scenario:standard" ||
      interactionId === "scenario:travel",
  );
  const comparisonComplete =
    state.adaptiveInteractionIds.includes("comparison:original") &&
    state.adaptiveInteractionIds.includes("comparison:adapted");

  useEffect(() => {
    if (!narrationEnabled || !state.hydrated) {
      stop();
      return;
    }

    void speak(
      experience.caption,
      `demonstration:${state.atlasCaptionId}:${state.captionRevision}`,
    );
  }, [
    experience.caption,
    narrationEnabled,
    speak,
    state.atlasCaptionId,
    state.captionRevision,
    state.hydrated,
    stop,
  ]);

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
    actionLabel = "Continue to Adaptive Intelligence";
    actionHint = "Connected information becomes context";
    onAction = () => {
      void import(
        "./discoveries/adaptive-intelligence/AdaptiveIntelligenceSystem"
      );
      experience.startAdaptiveIntelligence();
    };
  } else if (state.stage === "adaptive-transition") {
    actionLabel = "Show me";
    actionHint = "How Atlas turns connected information into action";
    onAction = experience.beginAdaptiveAnalysis;
  } else if (state.stage === "adaptive-analysis") {
    const analysisActions = [
      "Connect the context",
      "Identify the pressure",
      "Build the response",
      "Reveal the opportunities",
    ];
    actionLabel =
      analysisActions[state.analysisStageIndex] ?? "Continue the analysis";
    actionHint = `${state.analysisStageIndex + 1} of 4 analysis states`;
    onAction = experience.advanceAdaptiveAnalysis;
  } else if (state.stage === "adaptive-opportunities") {
    actionLabel = state.selectedOpportunityId
      ? "Show Atlas reasoning"
      : "Choose an opportunity";
    actionHint = state.selectedOpportunityId
      ? "Inspect how the signals contribute"
      : "Protect recovery · preserve clarity · adapt training";
    actionDisabled = !state.selectedOpportunityId;
    onAction = experience.beginAdaptiveReasoning;
  } else if (state.stage === "adaptive-reasoning") {
    actionLabel = enoughReasoning ? "Change the conditions" : "Inspect the chain";
    actionHint = enoughReasoning
      ? "Transparent reasoning established"
      : `${state.inspectedReasoningStepIds.length} of 3 reasoning steps inspected`;
    actionDisabled = !enoughReasoning;
    onAction = experience.beginScenarioControl;
  } else if (state.stage === "adaptive-scenarios") {
    actionLabel = scenarioChanged
      ? "Open the adapted protocol"
      : "Change the simulated day";
    actionHint = scenarioChanged
      ? `Atlas priority · ${state.scenarioId}`
      : "Standard · high-demand · travel";
    actionDisabled = !scenarioChanged;
    onAction = experience.beginAdaptiveProtocol;
  } else if (state.stage === "adaptive-protocol") {
    actionLabel = comparisonComplete
      ? "Model one changed condition"
      : "Compare both plans";
    actionHint = comparisonComplete
      ? "Original and adapted states compared"
      : "Toggle Original Day and Atlas-Adapted Day";
    actionDisabled = !comparisonComplete;
    onAction = experience.beginAdaptiveWhatIf;
  } else if (state.stage === "adaptive-what-if") {
    actionLabel =
      state.sleepAdjustmentMinutes === 45
        ? "Complete the demonstration"
        : "Move the model to +45 minutes";
    actionHint = "Qualitative scenario model · no fabricated precision";
    actionDisabled = state.sleepAdjustmentMinutes !== 45;
    onAction = experience.beginAdaptiveClosing;
  } else if (state.stage === "adaptive-closing") {
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
  const showAdaptiveIntelligence =
    state.stage.startsWith("adaptive-") || state.stage === "complete";
  const sceneKey = showConnectedMan
    ? "connected-man"
    : showAdaptiveIntelligence
      ? `adaptive-${state.stage}`
      : state.stage;

  return (
    <PreviewShell
      firstName={firstName}
      memberNumber={memberNumber}
      stage={state.stage}
      interactionCount={state.meaningfulInteractionIds.length}
      adaptiveInteractionCount={state.adaptiveInteractionIds.length}
      relationshipCount={state.revealedRelationshipIds.length}
      caption={experience.caption}
      captionRevision={state.captionRevision}
      captionsEnabled={state.captionsEnabled}
      narrationEnabled={narrationEnabled}
      narrationStatus={narrationStatus}
      narrationError={narrationError}
      narrationHasAudio={narrationHasAudio}
      narrationMuted={narrationMuted}
      reducedMotion={state.reducedMotion}
      actionLabel={actionLabel}
      actionHint={actionHint}
      actionDisabled={actionDisabled}
      onAction={onAction}
      onReplayCaption={experience.replayCaption}
      onToggleCaptions={experience.toggleCaptions}
      onPauseNarration={pause}
      onResumeNarration={() => void resume()}
      onToggleNarrationMute={toggleMuted}
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
            ) : state.stage === "closing" ? (
              <PreviewCompletion
                firstName={firstName}
                completed={false}
                reducedMotion={state.reducedMotion}
                onReopen={experience.reopenDemonstration}
              />
            ) : showAdaptiveIntelligence ? (
              <AdaptiveIntelligenceSystem
                firstName={firstName}
                stage={state.stage}
                analysisStageIndex={state.analysisStageIndex}
                selectedOpportunityId={state.selectedOpportunityId}
                activeReasoningStepId={state.activeReasoningStepId}
                inspectedReasoningStepIds={state.inspectedReasoningStepIds}
                scenarioId={state.scenarioId}
                comparisonMode={state.comparisonMode}
                sleepAdjustmentMinutes={state.sleepAdjustmentMinutes}
                reducedMotion={state.reducedMotion}
                completed={state.stage === "complete"}
                onSelectOpportunity={experience.selectAdaptiveOpportunity}
                onInspectReasoningStep={experience.inspectReasoningStep}
                onSelectScenario={experience.selectAdaptiveScenario}
                onSetComparison={experience.setProtocolComparison}
                onSetSleepAdjustment={experience.setSleepAdjustment}
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
