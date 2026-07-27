"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { DigitalTwinInsight as DigitalTwinInsightData } from "@/data/preview/digital-twin";

export function DigitalTwinInsight({
  insight,
  reducedMotion,
}: {
  insight: DigitalTwinInsightData | null;
  reducedMotion: boolean;
}) {
  return (
    <aside className="digital-twin-insight" aria-live="polite">
      <AnimatePresence mode="wait">
        {insight ? (
          <motion.div
            key={insight.id}
            initial={reducedMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.42 }}
          >
            <span className="digital-twin-insight__eyebrow">
              {insight.eyebrow}
            </span>
            <h4>{insight.title}</h4>
            <p>{insight.body}</p>
            <div className="digital-twin-insight__links">
              <small>Connected signals</small>
              {insight.relationships.map((relationship, index) => (
                <span key={relationship}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  {relationship}
                </span>
              ))}
            </div>
            <div className="digital-twin-insight__response">
              <span>Potential response</span>
              <strong>{insight.response}</strong>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="awaiting"
            className="digital-twin-insight__empty"
            initial={false}
            animate={{ opacity: 1 }}
          >
            <i aria-hidden="true" />
            <span>Atlas is ready</span>
            <h4>Touch a system to reveal its relationships.</h4>
            <p>
              Begin with Sleep, then explore how the model reorganizes around
              another signal.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
