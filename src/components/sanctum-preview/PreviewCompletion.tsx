"use client";

import { motion } from "framer-motion";

export function PreviewCompletion({
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
    <section className="preview-completion atlas-demonstration-closing">
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
        <span>
          {completed
            ? "The Atlas Demonstration · Complete"
            : "The Atlas Demonstration · Closing"}
        </span>
        <h2>This is only the beginning.</h2>
        <div className="atlas-closing-script">
          <p>What you have seen is not the finished platform.</p>
          <p>
            It is the foundation of a private operating system designed around
            the whole man.
          </p>
          <p>
            {firstName}, as a founding member, you will be among the first
            invited inside.
          </p>
        </div>
        {completed ? (
          <button
            className="atlas-reopen-action"
            type="button"
            onClick={onReopen}
          >
            Reopen the connected system
          </button>
        ) : null}
      </div>
      <div className="preview-completion__next">
        <span>Your discoveries are preserved</span>
        <strong>The Connected Man</strong>
        <small>
          Six relationships · four pillars · one evolving intelligence system
        </small>
      </div>
    </section>
  );
}
