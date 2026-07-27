"use client";

import { motion } from "framer-motion";

export function AdaptiveClosing({
  firstName,
  completed,
  reducedMotion,
  onReopen,
}: {
  firstName: string;
  completed: boolean;
  reducedMotion: boolean;
  onReopen: () => void;
}) {
  return (
    <section className="adaptive-closing">
      <motion.div
        className="adaptive-closing__core"
        initial={reducedMotion ? false : { scale: 0.84, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.7 }}
      >
        <i aria-hidden="true" />
        <span>A</span>
      </motion.div>
      <div className="adaptive-closing__copy">
        <span>
          {completed
            ? "Adaptive Intelligence · Complete"
            : "The Atlas Demonstration · Closing"}
        </span>
        <h3>The response becomes more intelligent.</h3>
        <p>
          What you are seeing is not a static plan. It is a future system
          designed to adapt around the man using it.
        </p>
        <p>
          {firstName}, the goal remains the same. The response changes as the
          day changes.
        </p>
        <small>
          Simulated future capability · no private member data analyzed
        </small>
        {completed ? (
          <button type="button" onClick={onReopen}>
            Reopen adaptive scenarios
          </button>
        ) : null}
      </div>
      <div className="adaptive-closing__summary">
        <span>One connected intelligence system</span>
        <strong>Observe · Connect · Prioritize · Adapt</strong>
        <small>Transparent reasoning. Context-aware response.</small>
      </div>
    </section>
  );
}
