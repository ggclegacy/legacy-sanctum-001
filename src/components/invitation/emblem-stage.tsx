import Image from "next/image";

type EmblemStageProps = {
  compact?: boolean;
  priority?: boolean;
};

export function EmblemStage({
  compact = false,
  priority = false,
}: EmblemStageProps) {
  return (
    <div
      className={`emblem-stage ${compact ? "emblem-stage--compact" : ""}`}
      aria-hidden="true"
    >
      <div className="emblem-orbit emblem-orbit--outer" />
      <div className="emblem-orbit emblem-orbit--inner" />
      <div className="emblem-light-sweep" />
      <div className="emblem-image-wrap">
        <Image
          src="/icon.png"
          alt=""
          fill
          unoptimized
          priority={priority}
          sizes={compact ? "(max-width: 720px) 42vw, 260px" : "(max-width: 720px) 80vw, 560px"}
          className="emblem-image"
        />
      </div>
    </div>
  );
}
