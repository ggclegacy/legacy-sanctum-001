"use client";

import { motion } from "framer-motion";

import type { CapabilityDefinition } from "@/lib/preview/preview-types";

export function CapabilityNode({
  capability,
  x,
  y,
  active,
  reducedMotion,
  onSelect,
}: {
  capability: CapabilityDefinition;
  x: number;
  y: number;
  active: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      className={`connected-capability-node${active ? " is-active" : ""}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      type="button"
      aria-pressed={active}
      aria-label={`Explore ${capability.label} relationship`}
      onClick={onSelect}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.42 }}
    >
      <i>{capability.shortLabel}</i>
      <span>{capability.label}</span>
    </motion.button>
  );
}
