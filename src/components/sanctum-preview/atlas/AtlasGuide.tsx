"use client";

import type { AtlasPlaybackStatus } from "@/hooks/useAtlasNarration";

import { AtlasCaption } from "./AtlasCaption";
import { AtlasOrb } from "./AtlasOrb";

export function AtlasGuide({
  caption,
  captionRevision,
  captionsEnabled,
  narrationEnabled,
  narrationStatus,
  narrationError,
  narrationHasAudio,
  narrationMuted,
  reducedMotion,
  actionLabel,
  actionHint,
  actionDisabled = false,
  onAction,
  onReplay,
  onPauseNarration,
  onResumeNarration,
  onToggleNarrationMute,
}: {
  caption: string;
  captionRevision: number;
  captionsEnabled: boolean;
  narrationEnabled: boolean;
  narrationStatus: AtlasPlaybackStatus;
  narrationError: string;
  narrationHasAudio: boolean;
  narrationMuted: boolean;
  reducedMotion: boolean;
  actionLabel: string;
  actionHint?: string;
  actionDisabled?: boolean;
  onAction: () => void;
  onReplay: () => void;
  onPauseNarration: () => void;
  onResumeNarration: () => void;
  onToggleNarrationMute: () => void;
}) {
  const voiceStatus =
    narrationStatus === "loading"
      ? "Generating voice…"
      : narrationStatus === "playing"
        ? "Atlas is speaking"
        : narrationStatus === "paused"
          ? "Voice paused"
          : narrationStatus === "ended"
            ? "Voice complete"
            : narrationStatus === "ready"
              ? "Voice ready"
              : narrationStatus === "error"
                ? "Voice unavailable"
                : "Atlas voice active";
  const canTogglePlayback =
    narrationHasAudio &&
    narrationStatus !== "loading" &&
    narrationStatus !== "ended";

  return (
    <footer className="atlas-guide">
      <div className="atlas-guide__voice">
        <AtlasOrb
          active={
            narrationEnabled &&
            (narrationStatus === "loading" || narrationStatus === "playing")
          }
          reducedMotion={reducedMotion}
        />
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
          aria-label={
            narrationEnabled
              ? "Replay Atlas voice and caption"
              : "Replay Atlas caption"
          }
        >
          Replay
        </button>
        {narrationEnabled ? (
          <div className="atlas-guide__audio" aria-label="Atlas voice controls">
            <span role="status">{voiceStatus}</span>
            <button
              type="button"
              onClick={
                narrationStatus === "playing"
                  ? onPauseNarration
                  : onResumeNarration
              }
              disabled={!canTogglePlayback}
            >
              {narrationStatus === "playing" ? "Pause" : "Resume"}
            </button>
            <button type="button" onClick={onToggleNarrationMute}>
              {narrationMuted ? "Unmute" : "Mute"}
            </button>
          </div>
        ) : null}
        {narrationError ? (
          <small className="atlas-guide__voice-error" role="alert">
            {narrationError}
          </small>
        ) : null}
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
