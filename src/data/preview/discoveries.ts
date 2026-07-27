import type {
  AtlasNarrationSegment,
  DiscoveryDefinition,
} from "@/lib/preview/preview-types";
import { getDigitalTwinNode } from "./digital-twin";

export const previewDiscoveries: DiscoveryDefinition[] = [
  {
    id: "digital-twin",
    number: 1,
    title: "Your Human Digital Twin",
    shortTitle: "Digital Twin",
    category: "atlas",
    introductionCaption:
      "I am going to show you what happens when the parts of your life stop behaving like isolated data.",
    completionCaption:
      "This is where isolated signals become a living model of the whole man.",
    estimatedSeconds: 75,
    requiredInteractions: 3,
    status: "available",
  },
  {
    id: "atlas-intelligence",
    number: 2,
    title: "Atlas Intelligence",
    shortTitle: "Atlas",
    category: "atlas",
    introductionCaption: "Atlas identifies opportunity before it is requested.",
    completionCaption: "A future discovery in the next focused build.",
    estimatedSeconds: 75,
    requiredInteractions: 3,
    status: "coming-soon",
  },
  {
    id: "adaptive-protocol",
    number: 3,
    title: "Adaptive Daily Protocol",
    shortTitle: "Protocol",
    category: "vitality",
    introductionCaption:
      "A daily protocol should adapt when the day changes.",
    completionCaption: "A future discovery in the next focused build.",
    estimatedSeconds: 75,
    requiredInteractions: 3,
    status: "coming-soon",
  },
];

export const atlasNarrationSegments: AtlasNarrationSegment[] = [
  {
    id: "preview-entry",
    discoveryId: "preview",
    trigger: "entry",
    caption:
      "The future member platform is not a dashboard. It is a private intelligence layer built around you.",
  },
  {
    id: "digital-twin-introduction",
    discoveryId: "digital-twin",
    trigger: "introduced",
    caption:
      "First, I assemble a living model of the systems that shape your capacity, decisions, and long horizon.",
  },
  {
    id: "digital-twin-prompt",
    discoveryId: "digital-twin",
    trigger: "active",
    caption:
      "Touch Sleep. Watch what changes when one signal becomes part of the whole.",
  },
  {
    id: "digital-twin-complete",
    discoveryId: "digital-twin",
    trigger: "completed",
    caption:
      "This is where isolated data becomes usable intelligence. The model changes as the man changes.",
  },
];

export function getAtlasCaption(captionId: string) {
  const nodeId = captionId.startsWith("digital-twin-node-")
    ? captionId.replace("digital-twin-node-", "")
    : null;
  const nodeCaption = getDigitalTwinNode(nodeId)?.atlasCaption;

  return (
    nodeCaption ??
    atlasNarrationSegments.find((segment) => segment.id === captionId)
      ?.caption ?? atlasNarrationSegments[0].caption
  );
}
