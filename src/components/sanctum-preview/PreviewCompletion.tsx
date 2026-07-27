"use client";

import { motion } from "framer-motion";

export function PreviewCompletion({
  firstName,
  reducedMotion,
}: {
  firstName: string;
  reducedMotion: boolean;
}) {
  return (
    <section className="preview-completion">
      <motion.div
        className="preview-completion__mark"
        initial={reducedMotion ? false : { scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.7 }}
      >
        <span>A</span>
        <i />
      </motion.div>
      <div>
        <span>Discovery complete · 01</span>
        <h2>The model changes as you change.</h2>
        <p>
          {firstName}, the future is not a collection of dashboards. It is one
          intelligence layer that understands the relationships across the
          whole man.
        </p>
      </div>
      <div className="preview-completion__next">
        <span>Next focused build</span>
        <strong>Atlas Intelligence</strong>
        <small>Opportunity detection · adaptive reasoning · active response</small>
      </div>
    </section>
  );
}
