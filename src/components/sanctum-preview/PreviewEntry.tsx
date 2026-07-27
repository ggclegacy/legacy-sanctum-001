"use client";

import { motion } from "framer-motion";

import { AtlasOrb } from "./atlas/AtlasOrb";

export function PreviewEntry({
  firstName,
  reducedMotion,
}: {
  firstName: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.section
      className="preview-entry"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="preview-entry__orb">
        <AtlasOrb active reducedMotion={reducedMotion} />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </div>
      <div className="preview-entry__copy">
        <span>Private future preview</span>
        <h2>
          {firstName}, this is not the member app.
          <em>This is what it will become.</em>
        </h2>
        <p>
          Atlas is about to open a private simulation of the intelligence layer
          being built around every Legacy Sanctum member.
        </p>
      </div>
      <div className="preview-entry__signals" aria-hidden="true">
        <span>Living member model</span>
        <span>Adaptive intelligence</span>
        <span>Long-horizon context</span>
      </div>
    </motion.section>
  );
}
