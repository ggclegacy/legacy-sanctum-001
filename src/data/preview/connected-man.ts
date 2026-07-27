import type {
  PillarDefinition,
  PillarId,
  RelationshipDefinition,
} from "@/lib/preview/preview-types";

export const connectedManPillars: PillarDefinition[] = [
  {
    id: "vitality",
    number: 1,
    label: "Vitality",
    shortLabel: "VT",
    statement: "Energy, recovery, and capacity for the work ahead.",
    x: 50,
    y: 9,
    defaultRelationshipId: "sleep-recovery-protocol",
    capabilities: [
      {
        id: "vitality-sleep",
        label: "Sleep",
        shortLabel: "SL",
        relationshipId: "sleep-recovery-protocol",
      },
      {
        id: "vitality-recovery",
        label: "Recovery",
        shortLabel: "RC",
        relationshipId: "sleep-recovery-protocol",
      },
      {
        id: "vitality-bloodwork",
        label: "Bloodwork",
        shortLabel: "BW",
        relationshipId: "vitality-leadership",
      },
      {
        id: "vitality-movement",
        label: "Movement",
        shortLabel: "MV",
        relationshipId: "vitality-leadership",
      },
      {
        id: "vitality-nutrition",
        label: "Nutrition",
        shortLabel: "NT",
        relationshipId: "sleep-recovery-protocol",
      },
      {
        id: "vitality-protocol",
        label: "Protocol",
        shortLabel: "PR",
        relationshipId: "sleep-recovery-protocol",
      },
    ],
  },
  {
    id: "mindset",
    number: 2,
    label: "Mindset",
    shortLabel: "MS",
    statement: "Clarity, discipline, and the quality of every decision.",
    x: 83,
    y: 50,
    defaultRelationshipId: "stress-focus-decisions",
    capabilities: [
      {
        id: "mindset-focus",
        label: "Focus",
        shortLabel: "FC",
        relationshipId: "stress-focus-decisions",
      },
      {
        id: "mindset-stress",
        label: "Stress",
        shortLabel: "ST",
        relationshipId: "stress-focus-decisions",
      },
      {
        id: "mindset-discipline",
        label: "Discipline",
        shortLabel: "DS",
        relationshipId: "mindset-goal-execution",
      },
      {
        id: "mindset-purpose",
        label: "Purpose",
        shortLabel: "PU",
        relationshipId: "mindset-goal-execution",
      },
      {
        id: "mindset-reflection",
        label: "Reflection",
        shortLabel: "RF",
        relationshipId: "mindset-goal-execution",
      },
      {
        id: "mindset-decision-load",
        label: "Decision Load",
        shortLabel: "DL",
        relationshipId: "stress-focus-decisions",
      },
    ],
  },
  {
    id: "brotherhood",
    number: 3,
    label: "Brotherhood",
    shortLabel: "BH",
    statement: "Trusted relationships at the moment they matter.",
    x: 50,
    y: 91,
    defaultRelationshipId: "trusted-introduction-opportunity",
    capabilities: [
      {
        id: "brotherhood-experts",
        label: "Trusted Experts",
        shortLabel: "TE",
        relationshipId: "trusted-introduction-opportunity",
      },
      {
        id: "brotherhood-mentors",
        label: "Mentors",
        shortLabel: "MN",
        relationshipId: "trusted-introduction-opportunity",
      },
      {
        id: "brotherhood-members",
        label: "Members",
        shortLabel: "MB",
        relationshipId: "trusted-introduction-opportunity",
      },
      {
        id: "brotherhood-introductions",
        label: "Introductions",
        shortLabel: "IN",
        relationshipId: "trusted-introduction-opportunity",
      },
      {
        id: "brotherhood-events",
        label: "Events",
        shortLabel: "EV",
        relationshipId: "trusted-introduction-opportunity",
      },
      {
        id: "brotherhood-accountability",
        label: "Accountability",
        shortLabel: "AC",
        relationshipId: "trusted-introduction-opportunity",
      },
    ],
  },
  {
    id: "legacy",
    number: 4,
    label: "Legacy",
    shortLabel: "LG",
    statement: "What the man is building, protecting, and leaving behind.",
    x: 17,
    y: 50,
    defaultRelationshipId: "leadership-family-legacy",
    capabilities: [
      {
        id: "legacy-leadership",
        label: "Leadership",
        shortLabel: "LD",
        relationshipId: "vitality-leadership",
      },
      {
        id: "legacy-business",
        label: "Business",
        shortLabel: "BU",
        relationshipId: "mindset-goal-execution",
      },
      {
        id: "legacy-family",
        label: "Family",
        shortLabel: "FM",
        relationshipId: "leadership-family-legacy",
      },
      {
        id: "legacy-projects",
        label: "Projects",
        shortLabel: "PJ",
        relationshipId: "mindset-goal-execution",
      },
      {
        id: "legacy-wealth",
        label: "Wealth",
        shortLabel: "WL",
        relationshipId: "leadership-family-legacy",
      },
      {
        id: "legacy-impact",
        label: "Impact",
        shortLabel: "IM",
        relationshipId: "leadership-family-legacy",
      },
    ],
  },
];

export const connectedManRelationships: RelationshipDefinition[] = [
  {
    id: "sleep-recovery-protocol",
    anchorPillarId: "vitality",
    relatedPillarIds: ["vitality"],
    title: "The day adapts before it begins.",
    path: ["Sleep", "Recovery", "Daily Protocol"],
    capabilityIds: [
      "vitality-sleep",
      "vitality-recovery",
      "vitality-bloodwork",
      "vitality-protocol",
    ],
    demonstration:
      "Imagine a poor night of sleep automatically reshaping the next day’s training, hydration, recovery, and supplement timing.",
    atlasInsight:
      "Health data becomes valuable when it stops living in isolation.",
    response: "The protocol responds to the condition of the man.",
  },
  {
    id: "stress-focus-decisions",
    anchorPillarId: "mindset",
    relatedPillarIds: ["mindset"],
    title: "Pressure changes the decision environment.",
    path: ["Stress", "Focus", "Decision Quality"],
    capabilityIds: [
      "mindset-stress",
      "mindset-focus",
      "mindset-decision-load",
    ],
    demonstration:
      "Imagine Atlas recognizing when accumulating pressure begins to fragment focus and increase the cost of important decisions.",
    atlasInsight:
      "Better information is useful. Connected information becomes intelligence.",
    response: "Protect clarity before pressure becomes direction.",
  },
  {
    id: "trusted-introduction-opportunity",
    anchorPillarId: "brotherhood",
    relatedPillarIds: ["brotherhood", "legacy"],
    title: "The right relationship changes the horizon.",
    path: ["Brotherhood", "Trusted Introduction", "Opportunity"],
    capabilityIds: [
      "brotherhood-experts",
      "brotherhood-introductions",
      "brotherhood-members",
    ],
    demonstration:
      "Imagine the private network surfacing one trusted introduction because the timing, context, and shared ground align.",
    atlasInsight:
      "Atlas does not optimize for more connections. It surfaces the right connection at the right moment.",
    response: "Precision over popularity. Context before access.",
  },
  {
    id: "leadership-family-legacy",
    anchorPillarId: "legacy",
    relatedPillarIds: ["legacy"],
    title: "The horizon extends beyond the work.",
    path: ["Leadership", "Family", "Long-Term Legacy"],
    capabilityIds: ["legacy-leadership", "legacy-family", "legacy-impact"],
    demonstration:
      "Imagine seeing whether the way you lead today is reinforcing the family values and long-term impact you intend to preserve.",
    atlasInsight:
      "The future platform will connect what a man is building with what he intends to leave behind.",
    response: "The long horizon becomes part of the daily system.",
  },
  {
    id: "vitality-leadership",
    anchorPillarId: "legacy",
    relatedPillarIds: ["vitality", "mindset", "legacy"],
    title: "Capacity shapes what leadership can carry.",
    path: ["Recovery", "Decision Quality", "Leadership", "Long-Term Impact"],
    capabilityIds: [
      "vitality-recovery",
      "mindset-decision-load",
      "legacy-leadership",
    ],
    demonstration:
      "Imagine seeing how periods of poor recovery affect leadership pressure, decision quality, and progress toward long-term goals.",
    atlasInsight:
      "Legacy Sanctum was never intended to stop at health.",
    response: "Energy, clarity, and responsibility belong in one model.",
  },
  {
    id: "mindset-goal-execution",
    anchorPillarId: "mindset",
    relatedPillarIds: ["mindset", "legacy"],
    title: "Purpose becomes visible through execution.",
    path: ["Mindset", "Discipline", "Goal Execution"],
    capabilityIds: [
      "mindset-purpose",
      "mindset-discipline",
      "legacy-projects",
    ],
    demonstration:
      "Imagine Atlas noticing when the enduring objective has lost proximity to the member’s daily actions.",
    atlasInsight:
      "Atlas does not simply record the member’s life. It learns how one domain influences another.",
    response: "Reconnect the daily move to the enduring objective.",
  },
];

export function getPillar(pillarId: PillarId | null) {
  return connectedManPillars.find((pillar) => pillar.id === pillarId) ?? null;
}

export function getRelationship(relationshipId: string | null) {
  return (
    connectedManRelationships.find(
      (relationship) => relationship.id === relationshipId,
    ) ?? null
  );
}

export function getCapability(capabilityId: string | null) {
  for (const pillar of connectedManPillars) {
    const capability = pillar.capabilities.find(
      (item) => item.id === capabilityId,
    );
    if (capability) return { capability, pillar };
  }
  return null;
}
