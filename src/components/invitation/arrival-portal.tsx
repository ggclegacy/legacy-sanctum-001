"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type { InvitationExperienceData } from "@/types/invitation";

import { EmblemStage } from "./emblem-stage";
import { InvitationExperience } from "./invitation-experience";

type ArrivalStep = "welcome" | "access";
type AccessError = "invalid" | "locked" | "unavailable";

const accessErrorCopy: Record<AccessError, string> = {
  invalid: "That access code was not recognized. Check the card and try again.",
  locked: "Too many attempts. Wait a moment before trying again.",
  unavailable: "The private access point is temporarily unavailable.",
};

export function ArrivalPortal() {
  const [step, setStep] = useState<ArrivalStep>("welcome");
  const [accessCode, setAccessCode] = useState("");
  const [invitation, setInvitation] =
    useState<InvitationExperienceData | null>(null);
  const [preview, setPreview] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [error, setError] = useState<AccessError | null>(null);
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

  async function verifyAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/invitations/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        reason?: AccessError;
        invitation?: InvitationExperienceData;
        preview?: boolean;
        trackingEnabled?: boolean;
      };

      if (!response.ok || !payload.ok || !payload.invitation) {
        setError(payload.reason ?? "invalid");
        return;
      }

      setPreview(Boolean(payload.preview));
      setTrackingEnabled(Boolean(payload.trackingEnabled));
      setInvitation(payload.invitation);
    } catch {
      setError("unavailable");
    } finally {
      setLoading(false);
    }
  }

  function formatAccessCode(value: string) {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .slice(0, 14);
  }

  function resetEntry() {
    setInvitation(null);
    setPreview(false);
    setTrackingEnabled(false);
    setAccessCode("");
    setError(null);
    setStep("welcome");
  }

  if (invitation) {
    return (
      <InvitationExperience
        data={invitation}
        preview={preview}
        trackingEnabled={trackingEnabled}
        onExit={resetEntry}
      />
    );
  }

  return (
    <main className="sanctum-shell arrival-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="violet-horizon" aria-hidden="true" />
      <div className="corner-frame corner-frame--top" aria-hidden="true" />
      <div className="corner-frame corner-frame--bottom" aria-hidden="true" />

      <motion.section
        className="arrival-card"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        aria-labelledby="arrival-title"
      >
        <div className="status-line">
          <span className="status-dot status-dot--pulse" />
          Private invitation protocol
        </div>

        <EmblemStage compact={step === "access"} priority />

        <AnimatePresence mode="wait" initial={false}>
          {step === "welcome" ? (
            <motion.div
              key="welcome"
              className="arrival-copy"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={transition}
            >
              <p className="eyebrow">Legacy Sanctum</p>
              <h1 id="arrival-title">You were brought here with intention.</h1>
              <p className="arrival-lede">
                This private entry point recognizes every man individually.
                Your access designation is waiting inside the package.
              </p>

              <div className="entry-actions">
                <button
                  className="premium-button premium-button--primary"
                  type="button"
                  onClick={() => setStep("access")}
                >
                  <span>Enter the Sanctum</span>
                  <span className="button-mark" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="access"
              className="arrival-copy access-copy"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
            >
              <p className="eyebrow">Identity remains sealed</p>
              <h1 id="arrival-title">Enter your Legacy Access Code.</h1>
              <p className="arrival-lede">
                Use the designation printed inside your package. Your
                personalized experience begins the moment it is recognized.
              </p>

              <form className="access-code-form" onSubmit={verifyAccess}>
                <label htmlFor="legacy-access-code">Legacy Access Code</label>
                <div className="access-code-field">
                  <input
                    id="legacy-access-code"
                    name="accessCode"
                    type="text"
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    value={accessCode}
                    onChange={(event) =>
                      setAccessCode(formatAccessCode(event.target.value))
                    }
                    placeholder="LS-••-•••"
                    aria-describedby={error ? "access-error" : "access-help"}
                    disabled={loading}
                    required
                    autoFocus
                  />
                  <span aria-hidden="true">LS</span>
                </div>
                <span id="access-help" className="field-help">
                  Enter the complete designation, including dashes.
                </span>
                <AnimatePresence>
                  {error ? (
                    <motion.p
                      id="access-error"
                      className="form-error"
                      role="alert"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {accessErrorCopy[error]}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
                <button
                  className="premium-button premium-button--primary"
                  type="submit"
                  disabled={loading || accessCode.length < 9}
                >
                  {loading ? "Recognizing…" : "Recognize access"}
                </button>
              </form>

              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("welcome");
                }}
              >
                Return to arrival
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="arrival-footer">
          <span>By invitation only</span>
          <span aria-hidden="true">Universal access point · LS</span>
        </footer>
      </motion.section>
    </main>
  );
}
