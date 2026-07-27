import type { DemonstrationStage } from "@/lib/preview/preview-types";

const stageProgress: Record<DemonstrationStage, number> = {
  entry: 0,
  introduction: 12,
  "guided-vitality": 24,
  "vitality-insight": 40,
  "guided-legacy": 52,
  "legacy-insight": 68,
  "free-exploration": 78,
  closing: 95,
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
  closing: "Atlas closing",
  complete: "Complete",
};

export function PreviewProgress({
  stage,
  interactionCount,
  relationshipCount,
}: {
  stage: DemonstrationStage;
  interactionCount: number;
  relationshipCount: number;
}) {
  const progress =
    stage === "free-exploration"
      ? Math.min(92, stageProgress[stage] + interactionCount * 2)
      : stageProgress[stage];

  return (
    <div className="preview-progress" aria-label="Atlas Demonstration progress">
      <div className="preview-progress__identity">
        <span>Atlas Demonstration</span>
        <strong>The Connected Man</strong>
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
        <b>{String(relationshipCount).padStart(2, "0")} / 06</b>
      </div>
    </div>
  );
}
