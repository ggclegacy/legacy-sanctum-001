import type {
  DiscoveryDefinition,
  DiscoveryLifecycle,
  PreviewStage,
} from "@/lib/preview/preview-types";

export function PreviewProgress({
  discovery,
  lifecycle,
  stage,
  interactionCount,
}: {
  discovery: DiscoveryDefinition;
  lifecycle: DiscoveryLifecycle;
  stage: PreviewStage;
  interactionCount: number;
}) {
  const progress =
    stage === "entry"
      ? 0
      : stage === "atlas-introduction"
        ? 16
        : stage === "discovery-complete"
          ? 100
          : Math.min(
              84,
              24 +
                (interactionCount / discovery.requiredInteractions) * 60,
            );

  return (
    <div className="preview-progress" aria-label="Discovery progress">
      <div className="preview-progress__identity">
        <span>Discovery {String(discovery.number).padStart(2, "0")}</span>
        <strong>{discovery.shortTitle}</strong>
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
        <span>{lifecycle.replace("-", " ")}</span>
        <b>01 / 12</b>
      </div>
    </div>
  );
}
