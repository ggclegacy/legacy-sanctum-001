import type {
  AdaptiveAnalysisDefinition,
  AdaptiveOpportunityDefinition,
  AdaptiveOpportunityId,
  AdaptiveReasoningStepDefinition,
  AdaptiveScenarioDefinition,
  AdaptiveScenarioId,
  ScenarioModelState,
} from "@/lib/preview/preview-types";

export const adaptiveAnalysisStages: AdaptiveAnalysisDefinition[] = [
  {
    id: "reviewing-signals",
    label: "Reviewing Signals",
    caption: "The system must understand what changed.",
    inputs: [
      "Shorter-than-usual sleep",
      "Recovery trend",
      "Planned training",
      "Leadership schedule",
    ],
    output: "The day begins with less recovery margin and more demand.",
  },
  {
    id: "connecting-context",
    label: "Connecting Context",
    caption: "Connected signals begin to establish context.",
    inputs: [
      "Reduced sleep",
      "High decision load",
      "Late training window",
      "Extended workday",
    ],
    output: "No single signal defines the day. Their relationship does.",
  },
  {
    id: "identifying-pressure",
    label: "Identifying Pressure",
    caption: "Atlas identifies what deserves attention.",
    inputs: [
      "Lower recovery capacity",
      "Earlier hydration demand",
      "Reduced intense-training margin",
      "Greater evening recovery need",
    ],
    output: "Clarity and recovery carry the highest combined pressure.",
  },
  {
    id: "building-response",
    label: "Building Response",
    caption: "The response changes because the context changed.",
    inputs: [
      "Adjust training intensity",
      "Move hydration earlier",
      "Simplify nonessential steps",
      "Protect the recovery window",
    ],
    output: "Atlas builds one coordinated response around the same goal.",
  },
];

export const adaptiveOpportunities: AdaptiveOpportunityDefinition[] = [
  {
    id: "protect-recovery",
    number: 1,
    label: "Protect Recovery",
    observed: [
      "Shorter-than-usual sleep",
      "Extended leadership schedule",
      "Late training window",
    ],
    contributors: ["Sleep", "Schedule Demand", "Recovery", "Training Load"],
    significance:
      "Recovery demand may exceed the margin modeled for this simulated day.",
    response: [
      "Atlas could move hydration earlier",
      "Future adaptation may shorten training duration",
      "Atlas could simplify nonessential evening steps",
      "The recovery window could become the protected priority",
    ],
    atlasInsight:
      "Notice how several signals contribute to one decision. Protecting recovery is not a reaction to one number.",
  },
  {
    id: "preserve-decision-quality",
    number: 2,
    label: "Preserve Decision Quality",
    observed: [
      "High leadership demand",
      "Extended decision window",
      "Reduced recovery margin",
    ],
    contributors: ["Schedule Demand", "Focus", "Recovery", "Protocol"],
    significance:
      "A demanding leadership schedule can increase the value of preserving clarity over forcing maximum physical output.",
    response: [
      "Atlas could protect the highest-value focus window",
      "Future adaptation may reduce avoidable protocol complexity",
      "Training demand could shift away from the decision peak",
      "The evening reset could be prioritized",
    ],
    atlasInsight:
      "The goal remains the same. The response becomes more intelligent.",
  },
  {
    id: "adapt-training-load",
    number: 3,
    label: "Adapt Training Load",
    observed: [
      "Planned intense training",
      "Late performance window",
      "Higher recovery demand",
    ],
    contributors: ["Training Load", "Sleep", "Hydration", "Recovery"],
    significance:
      "The planned session may compete with the recovery and leadership demands modeled for the day.",
    response: [
      "Future adaptation may reduce training intensity",
      "Atlas could shorten the performance block",
      "Hydration could move ahead of the workday peak",
      "The original training goal remains visible",
    ],
    atlasInsight:
      "Adaptation does not abandon the objective. It protects the member’s capacity to continue pursuing it.",
  },
];

export const adaptiveReasoningSteps: AdaptiveReasoningStepDefinition[] = [
  {
    id: "shorter-sleep",
    label: "Shorter Sleep",
    explanation:
      "Sleep changes more than energy. It influences recovery capacity, attention, stress tolerance, and the demands placed on the rest of a simulated day.",
  },
  {
    id: "lower-recovery-capacity",
    label: "Lower Recovery Capacity",
    explanation:
      "With less modeled recovery margin, the same schedule and training plan can carry a different cost.",
  },
  {
    id: "higher-decision-demand",
    label: "Higher Decision Demand",
    explanation:
      "A demanding leadership schedule can increase the value of preserving clarity over forcing maximum physical output.",
  },
  {
    id: "reduced-training-margin",
    label: "Reduced Training Margin",
    explanation:
      "Training remains part of the goal, but its intensity and timing may need to respect the demands already connected to the day.",
  },
  {
    id: "adapted-daily-response",
    label: "Adapted Daily Response",
    explanation:
      "The protocol changes because the context changed. This demonstration models a possible response, not a medical prediction.",
  },
];

const originalDay = [
  {
    id: "original-morning",
    period: "MORNING" as const,
    label: "Normal morning protocol",
    detail: "The original plan begins without considering changed conditions.",
    change: "MAINTAINED" as const,
    emphasis: "normal" as const,
  },
  {
    id: "original-midday",
    period: "MIDDAY" as const,
    label: "Hydration begins later",
    detail: "Hydration remains attached to the original schedule.",
    change: "MAINTAINED" as const,
    emphasis: "normal" as const,
  },
  {
    id: "original-performance",
    period: "PERFORMANCE WINDOW" as const,
    label: "Full planned training",
    detail: "Intensity and duration remain unchanged.",
    change: "MAINTAINED" as const,
    emphasis: "priority" as const,
  },
  {
    id: "original-recovery",
    period: "RECOVERY WINDOW" as const,
    label: "Compressed recovery",
    detail: "The late session leaves a narrower recovery window.",
    change: "MAINTAINED" as const,
    emphasis: "softened" as const,
  },
  {
    id: "original-evening",
    period: "EVENING" as const,
    label: "Full evening protocol",
    detail: "Every planned step remains active despite the changed day.",
    change: "MAINTAINED" as const,
    emphasis: "normal" as const,
  },
];

export const adaptiveScenarios: AdaptiveScenarioDefinition[] = [
  {
    id: "standard",
    number: 1,
    label: "Standard Day",
    shortLabel: "Standard",
    signals: [
      "Normal sleep",
      "Moderate schedule demand",
      "Planned training",
      "Normal recovery",
    ],
    priority: "Maintain performance rhythm",
    training: "Full planned training",
    hydration: "Standard hydration timing",
    recovery: "Normal evening recovery",
    explanation:
      "The modeled conditions remain aligned with the original plan, so Atlas preserves the established rhythm.",
    originalProtocol: originalDay,
    adaptedProtocol: [
      {
        id: "standard-morning",
        period: "MORNING",
        label: "Morning protocol",
        detail: "The normal sequence remains active.",
        change: "MAINTAINED",
        emphasis: "normal",
      },
      {
        id: "standard-midday",
        period: "MIDDAY",
        label: "Standard hydration",
        detail: "Hydration follows the established timing.",
        change: "MAINTAINED",
        emphasis: "normal",
      },
      {
        id: "standard-performance",
        period: "PERFORMANCE WINDOW",
        label: "Full planned training",
        detail: "The performance window remains unchanged.",
        change: "MAINTAINED",
        emphasis: "priority",
      },
      {
        id: "standard-recovery",
        period: "RECOVERY WINDOW",
        label: "Normal recovery",
        detail: "Recovery follows the planned cadence.",
        change: "MAINTAINED",
        emphasis: "normal",
      },
      {
        id: "standard-evening",
        period: "EVENING",
        label: "Reflection and sleep protection",
        detail: "The normal evening sequence closes the day.",
        change: "MAINTAINED",
        emphasis: "normal",
      },
    ],
  },
  {
    id: "high-demand",
    number: 2,
    label: "High-Demand Day",
    shortLabel: "High Demand",
    signals: [
      "Shorter-than-usual sleep",
      "High leadership demand",
      "Extended workday",
      "Planned training",
    ],
    priority: "Preserve clarity and recovery",
    training: "Training intensity reduced",
    hydration: "Hydration moved earlier",
    recovery: "Stronger evening recovery emphasis",
    explanation:
      "The modeled day contains less recovery margin and more decision demand, so the response protects clarity and the evening recovery window.",
    originalProtocol: originalDay,
    adaptedProtocol: [
      {
        id: "demand-morning",
        period: "MORNING",
        label: "Hydration and focus preparation",
        detail: "Hydration moves forward before the leadership schedule peaks.",
        change: "MOVED EARLIER",
        emphasis: "priority",
      },
      {
        id: "demand-midday",
        period: "MIDDAY",
        label: "Movement reset",
        detail: "A concise movement interval protects continuity.",
        change: "ADDED",
        emphasis: "normal",
      },
      {
        id: "demand-performance",
        period: "PERFORMANCE WINDOW",
        label: "Shortened training block",
        detail: "Intensity and duration soften while the original goal remains.",
        change: "REDUCED",
        emphasis: "softened",
      },
      {
        id: "demand-recovery",
        period: "RECOVERY WINDOW",
        label: "Protected recovery window",
        detail: "Recovery becomes the evening priority.",
        change: "PRIORITIZED",
        emphasis: "priority",
      },
      {
        id: "demand-evening",
        period: "EVENING",
        label: "Simplified evening protocol",
        detail: "Nonessential complexity recedes to protect sleep.",
        change: "SIMPLIFIED",
        emphasis: "normal",
      },
    ],
  },
  {
    id: "travel",
    number: 3,
    label: "Travel Day",
    shortLabel: "Travel",
    signals: [
      "Schedule disruption",
      "Prolonged sitting",
      "Reduced routine consistency",
      "Uncertain food and hydration timing",
    ],
    priority: "Protect continuity",
    training: "Adjusted training expectation",
    hydration: "Travel hydration plan",
    recovery: "Evening reset sequence",
    explanation:
      "The modeled environment is less predictable, so Atlas simplifies the system around continuity rather than maximum output.",
    originalProtocol: originalDay,
    adaptedProtocol: [
      {
        id: "travel-morning",
        period: "MORNING",
        label: "Portable morning protocol",
        detail: "Only essential actions remain active.",
        change: "SIMPLIFIED",
        emphasis: "priority",
      },
      {
        id: "travel-midday",
        period: "MIDDAY",
        label: "Travel hydration plan",
        detail: "Hydration receives explicit portable timing.",
        change: "PRIORITIZED",
        emphasis: "priority",
      },
      {
        id: "travel-performance",
        period: "PERFORMANCE WINDOW",
        label: "Movement reminders",
        detail: "Short movement intervals replace the fixed session expectation.",
        change: "ADDED",
        emphasis: "normal",
      },
      {
        id: "travel-recovery",
        period: "RECOVERY WINDOW",
        label: "Adjusted training expectation",
        detail: "Training adapts to the available environment and time.",
        change: "REDUCED",
        emphasis: "softened",
      },
      {
        id: "travel-evening",
        period: "EVENING",
        label: "Evening reset sequence",
        detail: "A concise reset re-establishes continuity.",
        change: "ADDED",
        emphasis: "priority",
      },
    ],
  },
];

export function getAdaptiveOpportunity(
  opportunityId: AdaptiveOpportunityId | null,
) {
  return (
    adaptiveOpportunities.find((opportunity) => opportunity.id === opportunityId) ??
    null
  );
}

export function getAdaptiveScenario(scenarioId: AdaptiveScenarioId) {
  return (
    adaptiveScenarios.find((scenario) => scenario.id === scenarioId) ??
    adaptiveScenarios[1]
  );
}

export function getScenarioModelState(
  adjustmentMinutes: number,
): ScenarioModelState {
  if (adjustmentMinutes >= 45) {
    return {
      adjustmentMinutes: 45,
      recoveryCapacity: "balanced",
      trainingMargin: "expanded",
      protocolConstraint: "softened",
      explanation:
        "The modeled recovery warning softens, training margin expands, and fewer protective changes remain necessary.",
    };
  }

  if (adjustmentMinutes >= 20) {
    return {
      adjustmentMinutes,
      recoveryCapacity: "protected",
      trainingMargin: "protected",
      protocolConstraint: "prioritized",
      explanation:
        "The modeled margin improves, while Atlas continues to protect the highest-pressure parts of the day.",
    };
  }

  return {
    adjustmentMinutes,
    recoveryCapacity: "limited",
    trainingMargin: "limited",
    protocolConstraint: "prioritized",
    explanation:
      "The current simulated conditions retain limited recovery and training margin.",
  };
}
