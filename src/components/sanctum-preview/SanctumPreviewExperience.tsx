"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

import { createPreviewMember } from "@/data/preview/demo-member";
import { usePreviewExperience } from "@/hooks/usePreviewExperience";

import { PreviewCompletion } from "./PreviewCompletion";
import { PreviewEntry } from "./PreviewEntry";
import { PreviewIntroduction } from "./PreviewIntroduction";
import { PreviewShell } from "./PreviewShell";
import { DiscoveryBoundary } from "./shared/DiscoveryBoundary";

const DigitalTwinDiscovery = dynamic(
  () =>
    import(
      "./discoveries/digital-twin/DigitalTwinDiscovery"
    ).then((module) => module.DigitalTwinDiscovery),
  {
    loading: () => (
      <div className="discovery-loading" role="status">
        <i />
        <span>Atlas is assembling the relationship model…</span>
      </div>
    ),
  },
);

export function SanctumPreviewExperience({
  firstName,
  memberNumber,
}: {
  firstName: string;
  memberNumber: string;
}) {
  const experience = usePreviewExperience();
  const { state, discovery } = experience;
  const member = createPreviewMember(firstName, memberNumber);
  const lifecycle = state.discoveryLifecycle[discovery.id] ?? "locked";
  const hasRequiredInteractions =
    state.exploredNodeIds.length >= discovery.requiredInteractions;

  let actionLabel = "Open private preview";
  let actionHint = "Atlas-guided · captions active";
  let actionDisabled = false;
  let onAction = () => {
    void import("./discoveries/digital-twin/DigitalTwinDiscovery");
    experience.beginPreview();
  };

  if (state.stage === "atlas-introduction") {
    actionLabel = "Assemble the model";
    actionHint = "Discovery 01 · approximately 75 seconds";
    onAction = () => experience.activateDiscovery(discovery.id);
  } else if (
    state.stage === "discovery-active" ||
    state.stage === "discovery-insight"
  ) {
    actionLabel = hasRequiredInteractions
      ? "Reveal what Atlas found"
      : "Keep exploring";
    actionHint = hasRequiredInteractions
      ? "The first discovery is ready to close"
      : `${state.exploredNodeIds.length} of ${discovery.requiredInteractions} systems explored`;
    actionDisabled = !hasRequiredInteractions;
    onAction = () => experience.completeDiscovery(discovery.id);
  } else if (state.stage === "discovery-complete") {
    actionLabel = "Explore the model again";
    actionHint = "Continue the invitation with the controls below";
    onAction = () => experience.replayDiscovery(discovery.id);
  }

  return (
    <PreviewShell
      firstName={firstName}
      memberNumber={memberNumber}
      discovery={discovery}
      lifecycle={lifecycle}
      stage={state.stage}
      interactionCount={state.exploredNodeIds.length}
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
      <DiscoveryBoundary onReturn={experience.restartPreview}>
        <AnimatePresence mode="wait">
          <motion.div
            className="preview-stage__scene"
            key={
              state.stage === "discovery-insight"
                ? "discovery-active"
                : state.stage
            }
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
            ) : state.stage === "atlas-introduction" ? (
              <PreviewIntroduction reducedMotion={state.reducedMotion} />
            ) : state.stage === "discovery-complete" ? (
              <PreviewCompletion
                firstName={firstName}
                reducedMotion={state.reducedMotion}
              />
            ) : (
              <DigitalTwinDiscovery
                member={member}
                activeNodeId={state.activeNodeId}
                activeInsightId={state.activeInsightId}
                exploredNodeIds={state.exploredNodeIds}
                requiredInteractions={discovery.requiredInteractions}
                reducedMotion={state.reducedMotion}
                onInteract={(nodeId, insightId, captionId) =>
                  experience.interactWithNode(
                    discovery.id,
                    nodeId,
                    insightId,
                    captionId,
                  )
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </DiscoveryBoundary>
    </PreviewShell>
  );
}
