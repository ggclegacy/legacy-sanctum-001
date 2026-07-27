"use client";

import { motion } from "framer-motion";

import type { DigitalTwinNode as DigitalTwinNodeData } from "@/data/preview/digital-twin";

export function DigitalTwinNode({
  node,
  active,
  connected,
  explored,
  reducedMotion,
  onSelect,
}: {
  node: DigitalTwinNodeData;
  active: boolean;
  connected: boolean;
  explored: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  const stateClass = [
    "digital-twin-node",
    active ? "is-active" : "",
    connected ? "is-connected" : "",
    explored ? "is-explored" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={stateClass}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      type="button"
      aria-pressed={active}
      aria-label={`Explore ${node.label} relationships`}
      onClick={onSelect}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: reducedMotion ? 0 : node.y * 0.003,
        duration: reducedMotion ? 0 : 0.48,
      }}
    >
      <i aria-hidden="true">{node.shortLabel}</i>
      <span>{node.label}</span>
      <b aria-hidden="true" />
    </motion.button>
  );
}
