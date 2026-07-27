"use client";

import type { ReactNode } from "react";

import type { AtlasPlaybackStatus } from "@/hooks/useAtlasNarration";
import type { DemonstrationStage } from "@/lib/preview/preview-types";

import { AtlasGuide } from "./atlas/AtlasGuide";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewProgress } from "./PreviewProgress";
import { AmbientField } from "./shared/AmbientField";

export function PreviewShell({
  firstName,
  memberNumber,
  stage,
  interactionCount,
  adaptiveInteractionCount,
  relationshipCount,
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
  actionDisabled,
  onAction,
  onReplayCaption,
  onToggleCaptions,
  onPauseNarration,
  onResumeNarration,
  onToggleNarrationMute,
  children,
}: {
  firstName: string;
  memberNumber: string;
  stage: DemonstrationStage;
  interactionCount: number;
  adaptiveInteractionCount: number;
  relationshipCount: number;
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
  onReplayCaption: () => void;
  onToggleCaptions: () => void;
  onPauseNarration: () => void;
  onResumeNarration: () => void;
  onToggleNarrationMute: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className="sanctum-preview-experience atlas-demonstration-experience"
      aria-label="The Atlas Demonstration"
    >
      <AmbientField />
      <PreviewHeader
        firstName={firstName}
        memberNumber={memberNumber}
        captionsEnabled={captionsEnabled}
        onToggleCaptions={onToggleCaptions}
      />
      <PreviewProgress
        stage={stage}
        interactionCount={interactionCount}
        adaptiveInteractionCount={adaptiveInteractionCount}
        relationshipCount={relationshipCount}
      />
      <div className="preview-stage">{children}</div>
      <AtlasGuide
        caption={caption}
        captionRevision={captionRevision}
        captionsEnabled={captionsEnabled}
        narrationEnabled={narrationEnabled}
        narrationStatus={narrationStatus}
        narrationError={narrationError}
        narrationHasAudio={narrationHasAudio}
        narrationMuted={narrationMuted}
        reducedMotion={reducedMotion}
        actionLabel={actionLabel}
        actionHint={actionHint}
        actionDisabled={actionDisabled}
        onAction={onAction}
        onReplay={onReplayCaption}
        onPauseNarration={onPauseNarration}
        onResumeNarration={onResumeNarration}
        onToggleNarrationMute={onToggleNarrationMute}
      />
    </section>
  );
}
