"use client";

import {
  getDigitalTwinInsight,
  getDigitalTwinNode,
  type DigitalTwinNodeId,
} from "@/data/preview/digital-twin";
import type { PreviewMember } from "@/data/preview/demo-member";

import { DigitalTwinGraph } from "./DigitalTwinGraph";
import { DigitalTwinInsight } from "./DigitalTwinInsight";

export function DigitalTwinDiscovery({
  member,
  activeNodeId,
  activeInsightId,
  exploredNodeIds,
  requiredInteractions,
  reducedMotion,
  onInteract,
}: {
  member: PreviewMember;
  activeNodeId: string | null;
  activeInsightId: string | null;
  exploredNodeIds: string[];
  requiredInteractions: number;
  reducedMotion: boolean;
  onInteract: (
    nodeId: DigitalTwinNodeId,
    insightId: string,
    captionId: string,
  ) => void;
}) {
  const insight = getDigitalTwinInsight(activeInsightId);
  const remaining = Math.max(0, requiredInteractions - exploredNodeIds.length);

  function selectNode(nodeId: DigitalTwinNodeId) {
    const node = getDigitalTwinNode(nodeId);
    if (!node) return;
    onInteract(node.id, node.insightId, `digital-twin-node-${node.id}`);
  }

  return (
    <section className="digital-twin-discovery">
      <header className="digital-twin-heading">
        <div>
          <span>Discovery 01 · Human Digital Twin</span>
          <h3>Your data is not the model.</h3>
          <p>
            The relationships between your systems are where the intelligence
            begins.
          </p>
        </div>
        <div className="digital-twin-heading__status">
          <span>{member.dataLabel}</span>
          <strong>
            {remaining
              ? `${remaining} relationship${remaining === 1 ? "" : "s"} to reveal`
              : "Discovery threshold reached"}
          </strong>
        </div>
      </header>

      <div className="digital-twin-workspace">
        <DigitalTwinGraph
          member={member}
          activeNodeId={activeNodeId}
          exploredNodeIds={exploredNodeIds}
          reducedMotion={reducedMotion}
          onSelectNode={selectNode}
        />
        <DigitalTwinInsight insight={insight} reducedMotion={reducedMotion} />
      </div>

      <div className="digital-twin-footnote">
        <span>Future capability demonstration</span>
        <p>
          All relationships shown here use simulated demonstration data. No
          personal health analysis or medical guidance is being provided.
        </p>
      </div>
    </section>
  );
}
