"use client";

import type {
  AdaptiveOpportunityId,
  AdaptiveScenarioId,
  DemonstrationStage,
  ProtocolComparisonMode,
} from "@/lib/preview/preview-types";

import { AdaptiveAnalysis } from "./AdaptiveAnalysis";
import { AdaptiveClosing } from "./AdaptiveClosing";
import { AdaptiveOpportunities } from "./AdaptiveOpportunities";
import { AdaptiveReasoning } from "./AdaptiveReasoning";
import { AdaptiveScenarioLab } from "./AdaptiveScenarioLab";
import { AdaptiveTransition } from "./AdaptiveTransition";

export function AdaptiveIntelligenceSystem({
  firstName,
  stage,
  analysisStageIndex,
  selectedOpportunityId,
  activeReasoningStepId,
  inspectedReasoningStepIds,
  scenarioId,
  comparisonMode,
  sleepAdjustmentMinutes,
  reducedMotion,
  completed,
  onSelectOpportunity,
  onInspectReasoningStep,
  onSelectScenario,
  onSetComparison,
  onSetSleepAdjustment,
  onReopen,
}: {
  firstName: string;
  stage: DemonstrationStage;
  analysisStageIndex: number;
  selectedOpportunityId: AdaptiveOpportunityId | null;
  activeReasoningStepId: string | null;
  inspectedReasoningStepIds: string[];
  scenarioId: AdaptiveScenarioId;
  comparisonMode: ProtocolComparisonMode;
  sleepAdjustmentMinutes: number;
  reducedMotion: boolean;
  completed: boolean;
  onSelectOpportunity: (opportunityId: AdaptiveOpportunityId) => void;
  onInspectReasoningStep: (stepId: string) => void;
  onSelectScenario: (scenarioId: AdaptiveScenarioId) => void;
  onSetComparison: (mode: ProtocolComparisonMode) => void;
  onSetSleepAdjustment: (minutes: number) => void;
  onReopen: () => void;
}) {
  if (stage === "adaptive-transition") {
    return (
      <AdaptiveTransition
        firstName={firstName}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (stage === "adaptive-analysis") {
    return (
      <AdaptiveAnalysis
        activeIndex={analysisStageIndex}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (stage === "adaptive-opportunities") {
    return (
      <AdaptiveOpportunities
        selectedOpportunityId={selectedOpportunityId}
        reducedMotion={reducedMotion}
        onSelect={onSelectOpportunity}
      />
    );
  }

  if (stage === "adaptive-reasoning") {
    return (
      <AdaptiveReasoning
        opportunityId={selectedOpportunityId}
        activeStepId={activeReasoningStepId}
        inspectedStepIds={inspectedReasoningStepIds}
        reducedMotion={reducedMotion}
        onInspect={onInspectReasoningStep}
      />
    );
  }

  if (
    stage === "adaptive-scenarios" ||
    stage === "adaptive-protocol" ||
    stage === "adaptive-what-if"
  ) {
    return (
      <AdaptiveScenarioLab
        stage={stage}
        scenarioId={scenarioId}
        comparisonMode={comparisonMode}
        sleepAdjustmentMinutes={sleepAdjustmentMinutes}
        reducedMotion={reducedMotion}
        onSelectScenario={onSelectScenario}
        onSetComparison={onSetComparison}
        onSetSleepAdjustment={onSetSleepAdjustment}
      />
    );
  }

  return (
    <AdaptiveClosing
      firstName={firstName}
      completed={completed}
      reducedMotion={reducedMotion}
      onReopen={onReopen}
    />
  );
}
