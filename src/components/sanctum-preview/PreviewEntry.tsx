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
      className="preview-entry atlas-demonstration-entry"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="preview-entry__orb">
        <AtlasOrb active reducedMotion={reducedMotion} />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </div>
      <div className="preview-entry__copy">
        <span>Private founding-member chamber</span>
        <h2>
          The Atlas Demonstration
          <em>A private preview of what Legacy Sanctum is becoming.</em>
        </h2>
        <p>
          {firstName}, before we continue, Atlas would like to show you how the
          future platform will connect the parts of a man’s life that ordinary
          systems leave isolated.
        </p>
      </div>
      <div className="preview-entry__signals" aria-hidden="true">
        <span>Personally recognized</span>
        <span>Atlas guided</span>
        <span>Future capability</span>
      </div>
    </motion.section>
  );
}
