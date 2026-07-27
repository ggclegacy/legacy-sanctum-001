import type { DemonstrationStage } from "@/lib/preview/preview-types";

const stageProgress: Record<DemonstrationStage, number> = {
  entry: 0,
  introduction: 5,
  "guided-vitality": 10,
  "vitality-insight": 16,
  "guided-legacy": 21,
  "legacy-insight": 26,
  "free-exploration": 30,
  closing: 38,
  "adaptive-transition": 42,
  "adaptive-analysis": 49,
  "adaptive-opportunities": 58,
  "adaptive-reasoning": 67,
  "adaptive-scenarios": 76,
  "adaptive-protocol": 85,
  "adaptive-what-if": 93,
  "adaptive-closing": 98,
  complete: 100,
};

const stageLabels: Record<DemonstrationStage, string> = {
  entry: "Private entry",
  introduction: "Atlas introduction",
  "guided-vitality": "Vitality selected",
  "vitality-insight": "Vitality connected",
  "guided-legacy": "Legacy selected",
  "legacy-insight": "Whole-man connection",
  "free-exploration": "Free exploration",
  closing: "Connected Man complete",
  "adaptive-transition": "Adaptive Intelligence",
  "adaptive-analysis": "Atlas analysis",
  "adaptive-opportunities": "Priority field",
  "adaptive-reasoning": "Reasoning chain",
  "adaptive-scenarios": "Scenario control",
  "adaptive-protocol": "Adaptive protocol",
  "adaptive-what-if": "Scenario model",
  "adaptive-closing": "Atlas closing",
  complete: "Complete",
};

export function PreviewProgress({
  stage,
  interactionCount,
  adaptiveInteractionCount,
  relationshipCount,
}: {
  stage: DemonstrationStage;
  interactionCount: number;
  adaptiveInteractionCount: number;
  relationshipCount: number;
}) {
  const adaptiveStage =
    stage.startsWith("adaptive-") || stage === "complete";
  const progress =
    stage === "free-exploration"
      ? Math.min(37, stageProgress[stage] + interactionCount)
      : stageProgress[stage];

  return (
    <div className="preview-progress" aria-label="Atlas Demonstration progress">
      <div className="preview-progress__identity">
        <span>Atlas Demonstration</span>
        <strong>
          {adaptiveStage ? "Adaptive Intelligence" : "The Connected Man"}
        </strong>
      </div>
      <div
        className="preview-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className="preview-progress__meta">
        <span>{stageLabels[stage]}</span>
        <b>
          {adaptiveStage
            ? `${String(adaptiveInteractionCount).padStart(2, "0")} signals`
            : `${String(relationshipCount).padStart(2, "0")} / 06`}
        </b>
      </div>
    </div>
  );
}
