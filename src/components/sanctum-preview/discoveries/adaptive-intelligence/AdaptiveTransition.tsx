"use client";

import { motion } from "framer-motion";

export function AdaptiveTransition({
  firstName,
  reducedMotion,
}: {
  firstName: string;
  reducedMotion: boolean;
}) {
  const signals = ["Sleep", "Schedule Demand", "Recovery"];

  return (
    <section className="adaptive-transition">
      <div className="adaptive-transition__copy">
        <span>The Atlas Demonstration · 02</span>
        <h3>Adaptive Intelligence</h3>
        <p>
          {firstName}, leadership rarely allows every day to unfold as planned.
          The system around the man should be capable of changing with it.
        </p>
      </div>

      <div
        className="adaptive-transition__system"
        aria-label="Connected Man compressing into an Atlas intelligence core"
      >
        <motion.div
          className="adaptive-intelligence-core"
          initial={reducedMotion ? false : { scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.8 }}
        >
          <i aria-hidden="true" />
          <span>ATLAS</span>
          <strong>Context Core</strong>
          <small>Connected Man · compressed</small>
        </motion.div>
        {signals.map((signal, index) => (
          <motion.div
            className={`adaptive-incoming-signal adaptive-incoming-signal--${index + 1}`}
            key={signal}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reducedMotion ? 0 : 0.22 + index * 0.14,
              duration: reducedMotion ? 0 : 0.48,
            }}
          >
            <i>{String(index + 1).padStart(2, "0")}</i>
            <span>{signal}</span>
          </motion.div>
        ))}
        <svg
          className="adaptive-transition__lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="50" y1="50" x2="50" y2="10" />
          <line x1="50" y1="50" x2="88" y2="70" />
          <line x1="50" y1="50" x2="12" y2="70" />
        </svg>
      </div>

      <div className="adaptive-disclosure">
        <span>Preview scenario</span>
        <p>
          All signals in this chamber are simulated. Atlas is not analyzing
          private health, calendar, travel, or performance data.
        </p>
      </div>
    </section>
  );
}
