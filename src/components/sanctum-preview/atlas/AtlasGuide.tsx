"use client";

import { AtlasCaption } from "./AtlasCaption";
import { AtlasOrb } from "./AtlasOrb";

export function AtlasGuide({
  caption,
  captionRevision,
  captionsEnabled,
  reducedMotion,
  actionLabel,
  actionHint,
  actionDisabled = false,
  onAction,
  onReplay,
}: {
  caption: string;
  captionRevision: number;
  captionsEnabled: boolean;
  reducedMotion: boolean;
  actionLabel: string;
  actionHint?: string;
  actionDisabled?: boolean;
  onAction: () => void;
  onReplay: () => void;
}) {
  return (
    <footer className="atlas-guide">
      <div className="atlas-guide__voice">
        <AtlasOrb active reducedMotion={reducedMotion} />
        <AtlasCaption
          caption={caption}
          captionRevision={captionRevision}
          captionsEnabled={captionsEnabled}
          reducedMotion={reducedMotion}
        />
        <button
          className="atlas-guide__replay"
          type="button"
          onClick={onReplay}
          aria-label="Replay Atlas caption"
        >
          Replay
        </button>
      </div>
      <div className="atlas-guide__action">
        {actionHint ? <small>{actionHint}</small> : null}
        <button
          className="preview-action"
          type="button"
          onClick={onAction}
          disabled={actionDisabled}
        >
          <span>{actionLabel}</span>
          <b aria-hidden="true">↗</b>
        </button>
      </div>
    </footer>
  );
}
