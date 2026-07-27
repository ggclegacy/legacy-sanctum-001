"use client";

import { motion } from "framer-motion";

import type { PillarDefinition } from "@/lib/preview/preview-types";

export function PillarNode({
  pillar,
  active,
  related,
  explored,
  atlasTarget,
  locked,
  reducedMotion,
  onSelect,
}: {
  pillar: PillarDefinition;
  active: boolean;
  related: boolean;
  explored: boolean;
  atlasTarget: boolean;
  locked: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      className={[
        "connected-pillar",
        active ? "is-active" : "",
        related ? "is-related" : "",
        explored ? "is-explored" : "",
        atlasTarget ? "is-atlas-target" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ left: `${pillar.x}%`, top: `${pillar.y}%` }}
      type="button"
      disabled={locked}
      aria-pressed={active}
      aria-label={`Explore ${pillar.label}: ${pillar.statement}`}
      onClick={onSelect}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: reducedMotion ? 0 : pillar.number * 0.07,
        duration: reducedMotion ? 0 : 0.48,
      }}
    >
      <i aria-hidden="true">{pillar.shortLabel}</i>
      <span>
        <small>0{pillar.number}</small>
        <strong>{pillar.label}</strong>
      </span>
      {atlasTarget ? <b>Atlas selected</b> : null}
    </motion.button>
  );
}
