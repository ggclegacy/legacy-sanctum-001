"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type { InvitationExperienceData } from "@/types/invitation";

import { EmblemStage } from "./emblem-stage";
import { InvitationExperience } from "./invitation-experience";

type GateError = "invalid" | "locked" | "expired" | "revoked" | "unavailable";

const errorCopy: Record<GateError, string> = {
  invalid: "Access could not be verified. Check the key and try again.",
  locked: "This invitation is temporarily locked. Contact the founder for access.",
  expired: "This invitation is no longer active.",
  revoked: "This invitation is no longer active.",
  unavailable: "Private verification is not available yet. Please return shortly.",
};

export function InviteGate({ token }: { token: string }) {
  const [pin, setPin] = useState("");
  const [data, setData] = useState<InvitationExperienceData | null>(null);
  const [error, setError] = useState<GateError | null>(null);
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/invitations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, pin }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        reason?: GateError;
        invitation?: InvitationExperienceData;
      };

      if (!response.ok || !payload.ok || !payload.invitation) {
        setError(payload.reason ?? "invalid");
        return;
      }

      setData(payload.invitation);
    } catch {
      setError("unavailable");
    } finally {
      setLoading(false);
    }
  }

  if (data) {
    return <InvitationExperience data={data} />;
  }

  return (
    <main className="sanctum-shell gate-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="violet-horizon" aria-hidden="true" />

      <motion.section
        className="gate-card"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.8 }}
        aria-labelledby="gate-title"
      >
        <div className="status-line">
          <span className="status-dot status-dot--pulse" />
          Private invitation detected
        </div>
        <EmblemStage compact priority />
        <div className="gate-copy">
          <p className="eyebrow">Reserved access point</p>
          <h1 id="gate-title">Enter your private key.</h1>
          <p>
            Use the numeric key included with your package. Your identity
            remains concealed until access is verified.
          </p>
        </div>

        <form className="pin-form" onSubmit={handleSubmit}>
          <label htmlFor="invite-pin">Private access key</label>
          <input
            id="invite-pin"
            name="pin"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{4,6}"
            minLength={4}
            maxLength={6}
            value={pin}
            onChange={(event) =>
              setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="••••••"
            aria-describedby={error ? "gate-error" : "gate-help"}
            disabled={loading}
            required
          />
          <span id="gate-help" className="field-help">
            Four to six digits
          </span>

          <AnimatePresence>
            {error ? (
              <motion.p
                id="gate-error"
                className="form-error"
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errorCopy[error]}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button
            className="premium-button premium-button--primary"
            type="submit"
            disabled={loading || pin.length < 4}
          >
            {loading ? "Verifying…" : "Verify access"}
          </button>
        </form>

        <p className="privacy-note">
          No member information is revealed before verification.
        </p>
      </motion.section>
    </main>
  );
}
