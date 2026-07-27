"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { EmblemStage } from "./emblem-stage";

type EntryMode = "atlas" | "silent" | null;

export function ArrivalPortal() {
  const [mode, setMode] = useState<EntryMode>(null);
  const reduceMotion = useReducedMotion();

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <main className="sanctum-shell arrival-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="violet-horizon" aria-hidden="true" />

      <motion.section
        className="arrival-card"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        aria-labelledby="arrival-title"
      >
        <div className="status-line">
          <span className="status-dot" />
          Private member entry
        </div>

        <EmblemStage priority />

        <AnimatePresence mode="wait" initial={false}>
          {mode === null ? (
            <motion.div
              key="choice"
              className="arrival-copy"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={transition}
            >
              <p className="eyebrow">Legacy Sanctum</p>
              <h1 id="arrival-title">Your invitation begins here.</h1>
              <p className="arrival-lede">
                Choose how you would like to enter. Every spoken moment will
                remain visible on screen.
              </p>

              <div className="entry-actions" aria-label="Entry mode">
                <button
                  className="premium-button premium-button--primary"
                  type="button"
                  onClick={() => setMode("atlas")}
                >
                  <span>Begin with Atlas</span>
                  <span className="button-mark" aria-hidden="true">
                    A
                  </span>
                </button>
                <button
                  className="premium-button premium-button--secondary"
                  type="button"
                  onClick={() => setMode("silent")}
                >
                  Continue silently
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              className="arrival-copy"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
            >
              <p className="eyebrow">
                {mode === "atlas" ? "Atlas requested" : "Silent entry selected"}
              </p>
              <h1 id="arrival-title">The access point is ready.</h1>
              <p className="arrival-lede">
                {mode === "atlas"
                  ? "Approved Atlas narration will begin after your private invitation is verified. Captions remain active throughout."
                  : "Your complete invitation will be presented without audio."}
              </p>
              <div className="entry-instruction">
                <span className="entry-instruction__index">01</span>
                <p>
                  Scan the private mark included with your package to continue
                  through your secured invitation.
                </p>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => setMode(null)}
              >
                Change entry mode
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="arrival-footer">
          <span>Invitation required</span>
          <span aria-hidden="true">LS / 001</span>
        </footer>
      </motion.section>
    </main>
  );
}
