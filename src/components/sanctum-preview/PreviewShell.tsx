"use client";

import type { ReactNode } from "react";

import type {
  DiscoveryDefinition,
  DiscoveryLifecycle,
  PreviewStage,
} from "@/lib/preview/preview-types";

import { AtlasGuide } from "./atlas/AtlasGuide";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewProgress } from "./PreviewProgress";
import { AmbientField } from "./shared/AmbientField";

export function PreviewShell({
  firstName,
  memberNumber,
  discovery,
  lifecycle,
  stage,
  interactionCount,
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
  discovery: DiscoveryDefinition;
  lifecycle: DiscoveryLifecycle;
  stage: PreviewStage;
  interactionCount: number;
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
      className="sanctum-preview-experience"
      aria-label="Atlas-guided future member platform preview"
    >
      <AmbientField />
      <PreviewHeader
        firstName={firstName}
        memberNumber={memberNumber}
        captionsEnabled={captionsEnabled}
        onToggleCaptions={onToggleCaptions}
      />
      <PreviewProgress
        discovery={discovery}
        lifecycle={lifecycle}
        stage={stage}
        interactionCount={interactionCount}
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
