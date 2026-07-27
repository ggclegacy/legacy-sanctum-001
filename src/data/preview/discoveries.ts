import {
  adaptiveAnalysisStages,
  adaptiveReasoningSteps,
  getAdaptiveOpportunity,
  getAdaptiveScenario,
} from "./adaptive-intelligence";
import { getRelationship } from "./connected-man";
import type { AtlasNarrationSegment } from "@/lib/preview/preview-types";

export const atlasDemonstrationScript: AtlasNarrationSegment[] = [
  {
    id: "demonstration-entry",
    stage: "entry",
    trigger: "entry",
    caption:
      "{firstName}, before we continue, I would like to show you something.",
    durationMs: 3600,
    completionTrigger: "begin",
  },
  {
    id: "demonstration-introduction",
    stage: "introduction",
    trigger: "begin",
    caption: "Most platforms are built to track one part of a man’s life.",
    durationMs: 3800,
    completionTrigger: "start-connected-man",
  },
  {
    id: "guided-vitality",
    stage: "guided-vitality",
    trigger: "system-ready",
    caption: "Touch Vitality.",
    durationMs: 2200,
    completionTrigger: "vitality-activated",
  },
  {
    id: "vitality-insight",
    stage: "vitality-insight",
    trigger: "vitality-activated",
    caption:
      "Health data becomes valuable when it stops living in isolation.",
    durationMs: 4200,
    completionTrigger: "continue-to-legacy",
  },
  {
    id: "guided-legacy",
    stage: "guided-legacy",
    trigger: "vitality-understood",
    caption: "Now touch Legacy.",
    durationMs: 2200,
    completionTrigger: "legacy-activated",
  },
  {
    id: "legacy-insight",
    stage: "legacy-insight",
    trigger: "legacy-activated",
    caption: "Legacy Sanctum was never intended to stop at health.",
    durationMs: 4200,
    completionTrigger: "free-exploration",
  },
  {
    id: "free-exploration",
    stage: "free-exploration",
    trigger: "guided-sequence-complete",
    caption: "Explore the system. Every connection represents a future capability.",
    durationMs: 4200,
    completionTrigger: "closing-available",
  },
  {
    id: "free-exploration-return",
    stage: "free-exploration",
    trigger: "demonstration-reopened",
    caption:
      "Your discoveries remain intact. Continue anywhere in the system.",
    durationMs: 3600,
  },
  {
    id: "demonstration-closing",
    stage: "closing",
    trigger: "closing-started",
    caption:
      "What you have seen is not the finished platform. It is the foundation.",
    durationMs: 5000,
    completionTrigger: "start-adaptive-intelligence",
  },
  {
    id: "adaptive-transition",
    stage: "adaptive-transition",
    trigger: "connected-man-complete",
    caption:
      "Connected information creates context. But context alone is not enough.",
    durationMs: 4800,
    completionTrigger: "begin-adaptive-analysis",
  },
  {
    id: "adaptive-analysis-0",
    stage: "adaptive-analysis",
    trigger: "analysis-started",
    caption: adaptiveAnalysisStages[0].caption,
    durationMs: 3400,
    completionTrigger: "advance-analysis",
  },
  {
    id: "adaptive-analysis-1",
    stage: "adaptive-analysis",
    trigger: "analysis-advanced",
    caption: adaptiveAnalysisStages[1].caption,
    durationMs: 3400,
    completionTrigger: "advance-analysis",
  },
  {
    id: "adaptive-analysis-2",
    stage: "adaptive-analysis",
    trigger: "analysis-advanced",
    caption: adaptiveAnalysisStages[2].caption,
    durationMs: 3400,
    completionTrigger: "advance-analysis",
  },
  {
    id: "adaptive-analysis-3",
    stage: "adaptive-analysis",
    trigger: "analysis-advanced",
    caption: adaptiveAnalysisStages[3].caption,
    durationMs: 3400,
    completionTrigger: "reveal-opportunities",
  },
  {
    id: "adaptive-opportunities",
    stage: "adaptive-opportunities",
    trigger: "analysis-complete",
    caption:
      "I have identified three opportunities within this simulated day. Choose one.",
    durationMs: 4400,
    completionTrigger: "opportunity-selected",
  },
  {
    id: "adaptive-reasoning",
    stage: "adaptive-reasoning",
    trigger: "opportunity-selected",
    caption: "Notice how several signals contribute to one decision.",
    durationMs: 4000,
    completionTrigger: "reasoning-inspected",
  },
  {
    id: "adaptive-scenarios",
    stage: "adaptive-scenarios",
    trigger: "reasoning-understood",
    caption: "Now change the conditions.",
    durationMs: 3200,
    completionTrigger: "scenario-changed",
  },
  {
    id: "adaptive-protocol",
    stage: "adaptive-protocol",
    trigger: "scenario-selected",
    caption:
      "The protocol did not change because the goal changed. It changed because the day did.",
    durationMs: 5200,
    completionTrigger: "comparison-complete",
  },
  {
    id: "adaptive-what-if",
    stage: "adaptive-what-if",
    trigger: "comparison-complete",
    caption:
      "This is not a prediction of certainty. It is a model of how one condition can influence the system around it.",
    durationMs: 5200,
    completionTrigger: "model-adjusted",
  },
  {
    id: "adaptive-what-if-complete",
    stage: "adaptive-what-if",
    trigger: "model-adjusted",
    caption:
      "The goal remains the same. The response becomes more intelligent.",
    durationMs: 4200,
    completionTrigger: "adaptive-closing",
  },
  {
    id: "adaptive-closing",
    stage: "adaptive-closing",
    trigger: "adaptive-exploration-complete",
    caption:
      "What you are seeing is not a static plan. It is a future system designed to adapt around the man using it.",
    durationMs: 5600,
    completionTrigger: "return-to-invitation",
  },
  {
    id: "adaptive-reopened",
    stage: "adaptive-scenarios",
    trigger: "demonstration-reopened",
    caption:
      "Your simulated scenarios remain available. Change the conditions again.",
    durationMs: 3800,
  },
  {
    id: "demonstration-complete",
    stage: "complete",
    trigger: "completed",
    caption:
      "As a founding member, you will be among the first invited inside.",
    durationMs: 4200,
  },
];

export function getAtlasCaption(captionId: string, firstName: string) {
  const relationshipId = captionId.startsWith("relationship:")
    ? captionId.replace("relationship:", "")
    : null;
  const relationshipCaption = getRelationship(relationshipId)?.atlasInsight;
  const opportunityId = captionId.startsWith("adaptive-opportunity:")
    ? captionId.replace("adaptive-opportunity:", "")
    : null;
  const opportunityCaption = getAdaptiveOpportunity(
    opportunityId as Parameters<typeof getAdaptiveOpportunity>[0],
  )?.atlasInsight;
  const reasoningId = captionId.startsWith("adaptive-reasoning:")
    ? captionId.replace("adaptive-reasoning:", "")
    : null;
  const reasoningCaption = adaptiveReasoningSteps.find(
    (step) => step.id === reasoningId,
  )?.explanation;
  const scenarioId = captionId.startsWith("adaptive-scenario:")
    ? captionId.replace("adaptive-scenario:", "")
    : null;
  const scenarioCaption =
    scenarioId === "standard" ||
    scenarioId === "high-demand" ||
    scenarioId === "travel"
      ? `Atlas priority: ${getAdaptiveScenario(scenarioId).priority}.`
      : null;
  const comparisonCaption =
    captionId === "adaptive-comparison:original"
      ? "The original day remains unchanged even when the conditions do not."
      : captionId === "adaptive-comparison:adapted"
        ? "The protocol changes because the context changed."
        : null;
  const scriptedCaption = atlasDemonstrationScript.find(
    (segment) => segment.id === captionId,
  )?.caption;

  return (
    opportunityCaption ??
    reasoningCaption ??
    scenarioCaption ??
    comparisonCaption ??
    relationshipCaption ??
    scriptedCaption ??
    atlasDemonstrationScript[0].caption
  )
    .replaceAll("{firstName}", firstName);
}
