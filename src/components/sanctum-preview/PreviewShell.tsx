"use client";

import type { ReactNode } from "react";

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
  relationshipCount,
  caption,
  captionRevision,
  captionsEnabled,
  reducedMotion,
  actionLabel,
  actionHint,
  actionDisabled,
  onAction,
  onReplayCaption,
  onToggleCaptions,
  children,
}: {
  firstName: string;
  memberNumber: string;
  stage: DemonstrationStage;
  interactionCount: number;
  relationshipCount: number;
  caption: string;
  captionRevision: number;
  captionsEnabled: boolean;
  reducedMotion: boolean;
  actionLabel: string;
  actionHint?: string;
  actionDisabled?: boolean;
  onAction: () => void;
  onReplayCaption: () => void;
  onToggleCaptions: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className="sanctum-preview-experience atlas-demonstration-experience"
      aria-label="The Atlas Demonstration: The Connected Man"
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
        relationshipCount={relationshipCount}
      />
      <div className="preview-stage">{children}</div>
      <AtlasGuide
        caption={caption}
        captionRevision={captionRevision}
        captionsEnabled={captionsEnabled}
        reducedMotion={reducedMotion}
        actionLabel={actionLabel}
        actionHint={actionHint}
        actionDisabled={actionDisabled}
        onAction={onAction}
        onReplay={onReplayCaption}
      />
    </section>
  );
}
