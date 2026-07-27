"use client";

import { motion } from "framer-motion";

export function PreviewIntroduction({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const pillars = [
    ["01", "Vitality", "Capacity for the work ahead"],
    ["02", "Mindset", "Clarity under pressure"],
    ["03", "Brotherhood", "Trusted relationships in context"],
    ["04", "Legacy", "The enduring horizon"],
  ];

  return (
    <section className="preview-introduction atlas-demonstration-introduction">
      <div className="preview-introduction__copy">
        <span>The Connected Man</span>
        <h2>Most platforms track one part of a man’s life.</h2>
        <p>
          Legacy Sanctum is being built to understand how vitality, mindset,
          brotherhood, and legacy influence one another.
        </p>
      </div>
      <div className="preview-assembly" aria-label="Four connected domains">
        {pillars.map(([number, pillar, detail], index) => (
          <motion.div
            key={pillar}
            initial={reducedMotion ? false : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.09,
              duration: reducedMotion ? 0 : 0.45,
            }}
          >
            <span>{number}</span>
            <strong>
              {pillar}
              <small>{detail}</small>
            </strong>
            <i />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
