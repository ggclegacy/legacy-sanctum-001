import { getRelationship } from "./connected-man";
import type { AtlasNarrationSegment } from "@/lib/preview/preview-types";

export const atlasDemonstrationScript: AtlasNarrationSegment[] = [
  {
    id: "demonstration-entry",
    stage: "entry",
    trigger: "entry",
    caption:
      "{firstName}, before we continue, I would like to show you something.",
    durationMs: 3600,
    completionTrigger: "begin",
  },
  {
    id: "demonstration-introduction",
    stage: "introduction",
    trigger: "begin",
    caption: "Most platforms are built to track one part of a man’s life.",
    durationMs: 3800,
    completionTrigger: "start-connected-man",
  },
  {
    id: "guided-vitality",
    stage: "guided-vitality",
    trigger: "system-ready",
    caption: "Touch Vitality.",
    durationMs: 2200,
    completionTrigger: "vitality-activated",
  },
  {
    id: "vitality-insight",
    stage: "vitality-insight",
    trigger: "vitality-activated",
    caption:
      "Health data becomes valuable when it stops living in isolation.",
    durationMs: 4200,
    completionTrigger: "continue-to-legacy",
  },
  {
    id: "guided-legacy",
    stage: "guided-legacy",
    trigger: "vitality-understood",
    caption: "Now touch Legacy.",
    durationMs: 2200,
    completionTrigger: "legacy-activated",
  },
  {
    id: "legacy-insight",
    stage: "legacy-insight",
    trigger: "legacy-activated",
    caption: "Legacy Sanctum was never intended to stop at health.",
    durationMs: 4200,
    completionTrigger: "free-exploration",
  },
  {
    id: "free-exploration",
    stage: "free-exploration",
    trigger: "guided-sequence-complete",
    caption: "Explore the system. Every connection represents a future capability.",
    durationMs: 4200,
    completionTrigger: "closing-available",
  },
  {
    id: "free-exploration-return",
    stage: "free-exploration",
    trigger: "demonstration-reopened",
    caption:
      "Your discoveries remain intact. Continue anywhere in the system.",
    durationMs: 3600,
  },
  {
    id: "demonstration-closing",
    stage: "closing",
    trigger: "closing-started",
    caption:
      "What you have seen is not the finished platform. It is the foundation.",
    durationMs: 5000,
    completionTrigger: "return-to-invitation",
  },
  {
    id: "demonstration-complete",
    stage: "complete",
    trigger: "completed",
    caption:
      "As a founding member, you will be among the first invited inside.",
    durationMs: 4200,
  },
];

export function getAtlasCaption(captionId: string, firstName: string) {
  const relationshipId = captionId.startsWith("relationship:")
    ? captionId.replace("relationship:", "")
    : null;
  const relationshipCaption = getRelationship(relationshipId)?.atlasInsight;
  const scriptedCaption = atlasDemonstrationScript.find(
    (segment) => segment.id === captionId,
  )?.caption;

  return (relationshipCaption ?? scriptedCaption ?? atlasDemonstrationScript[0].caption)
    .replaceAll("{firstName}", firstName);
}
