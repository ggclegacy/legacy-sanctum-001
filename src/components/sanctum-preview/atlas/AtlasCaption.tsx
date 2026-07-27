"use client";

import { AnimatePresence, motion } from "framer-motion";

export function AtlasCaption({
  caption,
  captionRevision,
  captionsEnabled,
  reducedMotion,
}: {
  caption: string;
  captionRevision: number;
  captionsEnabled: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div className="atlas-caption" aria-live="polite" aria-atomic="true">
      <span>Atlas</span>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${caption}-${captionRevision}`}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.36 }}
        >
          {captionsEnabled
            ? caption
            : "Atlas captions are off. Every interaction remains available."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
