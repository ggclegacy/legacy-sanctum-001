export type DigitalTwinNodeId =
  | "sleep"
  | "recovery"
  | "bloodwork"
  | "hormones"
  | "stress"
  | "nutrition"
  | "movement"
  | "supplements"
  | "goals"
  | "lifestyle";

export type DigitalTwinNode = {
  id: DigitalTwinNodeId;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  connections: DigitalTwinNodeId[];
  insightId: string;
  atlasCaption: string;
};

export type DigitalTwinInsight = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  relationships: string[];
  response: string;
};

export const digitalTwinNodes: DigitalTwinNode[] = [
  {
    id: "sleep",
    label: "Sleep",
    shortLabel: "SL",
    x: 50,
    y: 7,
    connections: ["recovery", "stress", "hormones"],
    insightId: "sleep-system",
    atlasCaption:
      "Sleep is not one metric. It changes the behavior of recovery, stress, and hormone rhythm.",
  },
  {
    id: "recovery",
    label: "Recovery",
    shortLabel: "RC",
    x: 79,
    y: 18,
    connections: ["sleep", "movement", "nutrition"],
    insightId: "recovery-pattern",
    atlasCaption:
      "Recovery weakened in this simulation after short sleep and late training occurred together.",
  },
  {
    id: "movement",
    label: "Movement",
    shortLabel: "MV",
    x: 88,
    y: 43,
    connections: ["recovery", "goals", "stress"],
    insightId: "movement-load",
    atlasCaption:
      "Training load only becomes useful when the recovery cost and the objective are visible beside it.",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    shortLabel: "NT",
    x: 78,
    y: 72,
    connections: ["recovery", "bloodwork", "lifestyle"],
    insightId: "nutrition-timing",
    atlasCaption:
      "Meal timing changes the simulated recovery pattern more than any isolated food score.",
  },
  {
    id: "supplements",
    label: "Supplements",
    shortLabel: "SP",
    x: 57,
    y: 91,
    connections: ["bloodwork", "nutrition", "hormones"],
    insightId: "supplement-context",
    atlasCaption:
      "A supplement is context, not a strategy. Atlas connects it to labs, timing, and the wider protocol.",
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    shortLabel: "LF",
    x: 28,
    y: 88,
    connections: ["stress", "nutrition", "goals"],
    insightId: "lifestyle-pressure",
    atlasCaption:
      "The model distinguishes a difficult day from a persistent pattern before priorities are changed.",
  },
  {
    id: "goals",
    label: "Goals",
    shortLabel: "GL",
    x: 12,
    y: 68,
    connections: ["movement", "lifestyle", "nutrition"],
    insightId: "goal-alignment",
    atlasCaption:
      "The objective changes what optimal means. The same signal can produce a different response.",
  },
  {
    id: "stress",
    label: "Stress",
    shortLabel: "ST",
    x: 12,
    y: 37,
    connections: ["sleep", "recovery", "lifestyle"],
    insightId: "stress-load",
    atlasCaption:
      "Stress is read as load across the system—not as a single score in isolation.",
  },
  {
    id: "bloodwork",
    label: "Bloodwork",
    shortLabel: "BW",
    x: 29,
    y: 15,
    connections: ["hormones", "nutrition", "supplements"],
    insightId: "lab-context",
    atlasCaption:
      "A lab value gains meaning when its movement is compared with behavior, recovery, and protocol history.",
  },
  {
    id: "hormones",
    label: "Hormones",
    shortLabel: "HR",
    x: 50,
    y: 29,
    connections: ["sleep", "bloodwork", "stress"],
    insightId: "hormone-rhythm",
    atlasCaption:
      "The simulated pattern points to rhythm and context, never to a diagnosis.",
  },
];

export const digitalTwinInsights: DigitalTwinInsight[] = [
  {
    id: "sleep-system",
    eyebrow: "Example relationship",
    title: "Sleep changes the whole system.",
    body:
      "In this demonstration model, shorter sleep precedes lower recovery capacity, higher stress load, and a less stable morning hormone rhythm.",
    relationships: ["Recovery", "Stress", "Hormones"],
    response: "Protect consistency before adding complexity.",
  },
  {
    id: "recovery-pattern",
    eyebrow: "Simulated pattern",
    title: "Recovery has a cause, not just a score.",
    body:
      "The model connects lower readiness with the combination of fewer than six hours of sleep and a late training load.",
    relationships: ["Sleep duration", "Training timing", "Nutrition"],
    response: "Reduce intensity and move hydration earlier.",
  },
  {
    id: "movement-load",
    eyebrow: "Future capability",
    title: "Load is judged against capacity.",
    body:
      "Training is interpreted beside recovery, stress, and the member's current objective—not graded in isolation.",
    relationships: ["Recovery", "Stress", "Goals"],
    response: "Preserve the stimulus; adjust the cost.",
  },
  {
    id: "nutrition-timing",
    eyebrow: "Example relationship",
    title: "Timing changes the downstream signal.",
    body:
      "Late meals align with more fragmented sleep and lower morning readiness in this simulated scenario.",
    relationships: ["Meal timing", "Sleep", "Recovery"],
    response: "Move the final meal earlier in the demonstration protocol.",
  },
  {
    id: "supplement-context",
    eyebrow: "Future capability",
    title: "Protocol without context creates noise.",
    body:
      "Atlas would compare timing, lab history, nutrition, and the wider protocol before surfacing an opportunity.",
    relationships: ["Bloodwork", "Nutrition", "Hormones"],
    response: "Review the complete protocol, not one ingredient.",
  },
  {
    id: "lifestyle-pressure",
    eyebrow: "Simulated pattern",
    title: "One hard day is not a trend.",
    body:
      "The model separates temporary schedule pressure from repeated lifestyle strain before it changes priorities.",
    relationships: ["Stress", "Nutrition", "Goals"],
    response: "Watch the pattern before changing the system.",
  },
  {
    id: "goal-alignment",
    eyebrow: "Future capability",
    title: "The objective defines the response.",
    body:
      "The same recovery signal can produce a different protocol when the priority shifts from performance to restoration.",
    relationships: ["Movement", "Lifestyle", "Nutrition"],
    response: "Align the model with the season of work.",
  },
  {
    id: "stress-load",
    eyebrow: "Example relationship",
    title: "Stress behaves like system load.",
    body:
      "Simulated schedule pressure changes sleep quality, recovery demand, and lifestyle capacity together.",
    relationships: ["Sleep", "Recovery", "Lifestyle"],
    response: "Reduce load before adding another intervention.",
  },
  {
    id: "lab-context",
    eyebrow: "Simulated intelligence",
    title: "Movement matters more than one number.",
    body:
      "Atlas would compare the direction of a marker with behavior and protocol history without making a diagnosis.",
    relationships: ["Hormones", "Nutrition", "Supplements"],
    response: "Examine the relationship; preserve clinical judgment.",
  },
  {
    id: "hormone-rhythm",
    eyebrow: "Example relationship",
    title: "Rhythm creates context.",
    body:
      "This demonstration connects hormone patterns with sleep consistency, stress load, and bloodwork timing.",
    relationships: ["Sleep", "Stress", "Bloodwork"],
    response: "Observe the pattern without inferring a diagnosis.",
  },
];

export function getDigitalTwinNode(nodeId: string | null) {
  return digitalTwinNodes.find((node) => node.id === nodeId) ?? null;
}

export function getDigitalTwinInsight(insightId: string | null) {
  return (
    digitalTwinInsights.find((insight) => insight.id === insightId) ?? null
  );
}
