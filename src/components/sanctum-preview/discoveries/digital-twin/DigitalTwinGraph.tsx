"use client";

import { motion } from "framer-motion";

import {
  digitalTwinNodes,
  getDigitalTwinNode,
  type DigitalTwinNodeId,
} from "@/data/preview/digital-twin";
import type { PreviewMember } from "@/data/preview/demo-member";

import { DigitalTwinNode } from "./DigitalTwinNode";

export function DigitalTwinGraph({
  member,
  activeNodeId,
  exploredNodeIds,
  reducedMotion,
  onSelectNode,
}: {
  member: PreviewMember;
  activeNodeId: string | null;
  exploredNodeIds: string[];
  reducedMotion: boolean;
  onSelectNode: (nodeId: DigitalTwinNodeId) => void;
}) {
  const activeNode = getDigitalTwinNode(activeNodeId);
  const connectedIds = new Set(activeNode?.connections ?? []);
  const connectedNodes = digitalTwinNodes.filter((node) =>
    connectedIds.has(node.id),
  );

  return (
    <div
      className="digital-twin-graph"
      aria-label="Interactive relationship model"
    >
      <div className="digital-twin-grid" aria-hidden="true" />
      <svg
        className="digital-twin-connections"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {digitalTwinNodes.map((node) => (
          <line
            className="digital-twin-connection digital-twin-connection--base"
            key={`base-${node.id}`}
            x1="50"
            y1="55"
            x2={node.x}
            y2={node.y}
          />
        ))}
        {activeNode ? (
          <>
            <motion.line
              className="digital-twin-connection is-active"
              x1="50"
              y1="55"
              x2={activeNode.x}
              y2={activeNode.y}
              initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.5 }}
            />
            {connectedNodes.map((node, index) => (
              <motion.line
                className="digital-twin-connection is-related"
                key={`${activeNode.id}-${node.id}`}
                x1={activeNode.x}
                y1={activeNode.y}
                x2={node.x}
                y2={node.y}
                initial={
                  reducedMotion ? false : { pathLength: 0, opacity: 0 }
                }
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: reducedMotion ? 0 : index * 0.08,
                  duration: reducedMotion ? 0 : 0.54,
                }}
              />
            ))}
          </>
        ) : null}
      </svg>

      <div className="digital-twin-core">
        <i aria-hidden="true" />
        <span>{member.firstName.slice(0, 1).toUpperCase()}</span>
        <strong>{member.firstName}</strong>
        <small>Living model</small>
      </div>

      {digitalTwinNodes.map((node) => (
        <DigitalTwinNode
          key={node.id}
          node={node}
          active={activeNodeId === node.id}
          connected={connectedIds.has(node.id)}
          explored={exploredNodeIds.includes(node.id)}
          reducedMotion={reducedMotion}
          onSelect={() => onSelectNode(node.id)}
        />
      ))}

      <div className="digital-twin-graph__status">
        <span>{activeNode ? "Relationship active" : "Model assembled"}</span>
        <b>{activeNode?.label ?? "Choose a system"}</b>
      </div>
    </div>
  );
}
