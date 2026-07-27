"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { MemberAppPreview } from "@/components/preview/member-app-preview";
import {
  SCENE_KEYS,
  type InvitationExperienceData,
  type NarrationPreference,
  type SceneKey,
} from "@/types/invitation";

import { EmblemStage } from "./emblem-stage";

const pillars = [
  {
    index: "01",
    name: "Vitality",
    statement: "The strength, energy, and health required to carry the mission.",
  },
  {
    index: "02",
    name: "Mindset",
    statement: "The discipline, clarity, and resilience that direct the man.",
  },
  {
    index: "03",
    name: "Brotherhood",
    statement:
      "The trusted relationships, accountability, and access that support the ascent.",
  },
  {
    index: "04",
    name: "Legacy",
    statement: "What he is building, protecting, and leaving behind.",
  },
];

type InvitationExperienceProps = {
  data: InvitationExperienceData;
  preview?: boolean;
};

export function InvitationExperience({
  data,
  preview = false,
}: InvitationExperienceProps) {
  const [preference, setPreference] = useState<NarrationPreference | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneRevision, setSceneRevision] = useState(0);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();

  const sceneKey = SCENE_KEYS[sceneIndex];
  const narration = useMemo(
    () => data.narration.find((segment) => segment.sceneKey === sceneKey),
    [data.narration, sceneKey],
  );

  useEffect(() => {
    if (!preference) return;
    window.sessionStorage.setItem("sanctum-entry-mode", preference);
  }, [preference]);

  useEffect(() => {
    if (!preference || preview) return;
    void fetch("/api/invitations/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "scene_viewed",
        sceneKey,
      }),
    });
  }, [preference, preview, sceneKey]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || preference !== "atlas" || !narration?.audioPath) return;

    audio.currentTime = 0;
    if (!paused) {
      void audio.play().catch(() => setPaused(true));
    }
  }, [narration?.audioPath, paused, preference, sceneRevision]);

  function choosePreference(next: NarrationPreference) {
    setPreference(next);
    setMuted(next === "silent");
    if (!preview) {
      void fetch("/api/invitations/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: next === "atlas" ? "audio_enabled" : "audio_skipped",
          sceneKey: null,
        }),
      });
    }
  }

  function goToScene(nextIndex: number) {
    setSceneIndex(Math.max(0, Math.min(SCENE_KEYS.length - 1, nextIndex)));
    setPaused(false);
    setSceneRevision((value) => value + 1);
  }

  function togglePause() {
    const next = !paused;
    setPaused(next);
    if (audioRef.current) {
      if (next) audioRef.current.pause();
      else void audioRef.current.play().catch(() => setPaused(true));
    }
  }

  if (!preference) {
    return (
      <main className="sanctum-shell narration-shell">
        <div className="ambient-grid" aria-hidden="true" />
        <section className="narration-card" aria-labelledby="narration-title">
          <div className="status-line">
            <span className="status-dot" />
            Access verified
          </div>
          <EmblemStage compact priority />
          <p className="eyebrow">Choose your entry</p>
          <h1 id="narration-title">How would you like to enter?</h1>
          <p>
            Atlas narration plays only when an approved recording exists.
            Captions remain active in either mode.
          </p>
          <div className="entry-actions">
            <button
              className="premium-button premium-button--primary"
              type="button"
              onClick={() => choosePreference("atlas")}
            >
              Begin with Atlas
            </button>
            <button
              className="premium-button premium-button--secondary"
              type="button"
              onClick={() => choosePreference("silent")}
            >
              Continue silently
            </button>
          </div>
        </section>
      </main>
    );
  }

  const showAudioControls =
    preference === "atlas" && Boolean(narration?.audioPath);

  return (
    <main className="experience-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="experience-header">
        <span className="wordmark">Legacy Sanctum</span>
        <span className="member-marker">
          {data.memberType} · {data.memberNumber}
        </span>
      </header>

      <div
        className="scene-progress"
        role="progressbar"
        aria-label="Invitation progress"
        aria-valuemin={1}
        aria-valuemax={SCENE_KEYS.length}
        aria-valuenow={sceneIndex + 1}
      >
        {SCENE_KEYS.map((key, index) => (
          <span
            key={key}
            className={index <= sceneIndex ? "is-complete" : ""}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${sceneKey}-${sceneRevision}`}
          className={`scene scene--${sceneKey}`}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
          transition={{
            duration: reduceMotion ? 0 : 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-live="polite"
        >
          <SceneContent
            sceneKey={sceneKey}
            data={data}
            preview={preview}
            submitted={submitted}
            onSubmitted={() => setSubmitted(true)}
          />
        </motion.section>
      </AnimatePresence>

      <div className="caption-region" aria-live="polite">
        <span>{preference === "atlas" ? "Atlas" : "Silent mode"}</span>
        <p>
          {narration?.script ??
            "Approved narration has not been published for this scene. The complete message remains on screen."}
        </p>
      </div>

      <footer className="scene-controls">
        <button
          className="control-button"
          type="button"
          onClick={() => goToScene(sceneIndex - 1)}
          disabled={sceneIndex === 0}
        >
          Back
        </button>
        <div className="control-cluster">
          <button
            className="control-button"
            type="button"
            onClick={() => setSceneRevision((value) => value + 1)}
          >
            Replay
          </button>
          {showAudioControls ? (
            <>
              <button
                className="control-button"
                type="button"
                onClick={togglePause}
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                className="control-button"
                type="button"
                onClick={() => setMuted((value) => !value)}
              >
                {muted ? "Unmute" : "Mute"}
              </button>
            </>
          ) : null}
        </div>
        <button
          className="control-button control-button--next"
          type="button"
          onClick={() => goToScene(sceneIndex + 1)}
          disabled={sceneIndex === SCENE_KEYS.length - 1}
        >
          {sceneIndex === SCENE_KEYS.length - 2 ? "Complete" : "Continue"}
        </button>
      </footer>

      {narration?.audioPath ? (
        <audio
          ref={audioRef}
          src={narration.audioPath}
          muted={muted}
          preload="metadata"
          onEnded={() => setPaused(true)}
        />
      ) : null}
    </main>
  );
}

function SceneContent({
  sceneKey,
  data,
  preview,
  submitted,
  onSubmitted,
}: {
  sceneKey: SceneKey;
  data: InvitationExperienceData;
  preview: boolean;
  submitted: boolean;
  onSubmitted: () => void;
}) {
  switch (sceneKey) {
    case "recognition":
      return (
        <div className="scene-centered">
          <EmblemStage compact />
          <p className="eyebrow">Access recognized</p>
          <h1>Welcome, {data.firstName}.</h1>
          <p className="member-designation">
            {data.memberType} <span>·</span> {data.memberNumber}
          </p>
          {data.customHeadline ? (
            <p className="scene-lede">{data.customHeadline}</p>
          ) : null}
        </div>
      );
    case "founder":
      return (
        <div className="editorial-scene">
          <p className="scene-index">01 / A message from the founder</p>
          <blockquote>{data.founderMessage}</blockquote>
          <p className="signature">— Neil</p>
        </div>
      );
    case "selection":
      return (
        <div className="editorial-scene">
          <p className="scene-index">02 / Selected with intention</p>
          <h2>This invitation was created for you.</h2>
          <p className="scene-body">{data.whySelected}</p>
        </div>
      );
    case "pillars":
      return (
        <div className="pillars-scene">
          <div className="scene-heading">
            <p className="scene-index">03 / The foundation</p>
            <h2>Four disciplines. One enduring man.</h2>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.name}>
                <span>{pillar.index}</span>
                <h3>{pillar.name}</h3>
                <p>{pillar.statement}</p>
              </article>
            ))}
          </div>
        </div>
      );
    case "products":
      return (
        <div className="products-scene">
          <div className="scene-heading">
            <p className="scene-index">04 / Selected for your box</p>
            <h2>Tools for the work ahead.</h2>
          </div>
          {data.products.length ? (
            <div className="product-list">
              {data.products.map((product, index) => (
                <article className="product-card" key={product.id}>
                  <span className="product-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="micro-label">{product.shortPurpose}</p>
                    <h3>{product.name}</h3>
                    <p>{product.selectionReason}</p>
                    {product.usageNote ? (
                      <small>{product.usageNote}</small>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="preview-warning">
              {preview
                ? "Product assignments are intentionally omitted from the internal preview."
                : "No products are assigned to this invitation."}
            </p>
          )}
        </div>
      );
    case "platform":
      return (
        <div className="platform-scene">
          <div className="scene-heading">
            <p className="scene-index">05 / Beyond the box</p>
            <h2>The products are the beginning, not the boundary.</h2>
            <p>{data.visionMessage}</p>
          </div>
          <MemberAppPreview />
        </div>
      );
    case "founding":
      return (
        <div className="founding-scene">
          <p className="scene-index">06 / Your place in the Sanctum</p>
          <span className="founding-number">{data.memberNumber}</span>
          <h2>Founding membership has meaning.</h2>
          <p>{data.foundingMemberMessage}</p>
        </div>
      );
    case "response":
      return (
        <ResponseScene
          preview={preview}
          submitted={submitted}
          onSubmitted={onSubmitted}
        />
      );
    case "completion":
      return (
        <div className="scene-centered completion-scene">
          <EmblemStage compact />
          <p className="eyebrow">Your response has been recorded</p>
          <h2>The Sanctum is still being forged.</h2>
          <p className="scene-lede">{data.closingMessage}</p>
        </div>
      );
  }
}

function ResponseScene({
  preview,
  submitted,
  onSubmitted,
}: {
  preview: boolean;
  submitted: boolean;
  onSubmitted: () => void;
}) {
  const [responseType, setResponseType] = useState("accepted");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitResponse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (preview) {
      onSubmitted();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/invitations/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseType,
          message,
          preferredContactMethod:
            responseType === "conversation_requested" ? "either" : "none",
        }),
      });
      if (!response.ok) throw new Error("response failed");
      onSubmitted();
    } catch {
      setError("Your response could not be recorded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="response-confirmation">
        <p className="scene-index">07 / Response received</p>
        <h2>Your intention has been recorded.</h2>
        <p>Continue to close your private entry experience.</p>
      </div>
    );
  }

  return (
    <div className="response-scene">
      <div className="scene-heading">
        <p className="scene-index">07 / Your response</p>
        <h2>Choose your next step.</h2>
        <p>
          This invitation is intentional. Your response should be, too.
        </p>
      </div>
      <form className="response-form" onSubmit={submitResponse}>
        <fieldset>
          <legend>Response</legend>
          {[
            ["accepted", "Accept your place"],
            ["feedback", "Leave private feedback"],
            ["conversation_requested", "Request a conversation"],
            ["product_recipient_only", "Remain a product recipient"],
          ].map(([value, label]) => (
            <label className="response-option" key={value}>
              <input
                type="radio"
                name="responseType"
                value={value}
                checked={responseType === value}
                onChange={(event) => setResponseType(event.target.value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <label className="message-field" htmlFor="response-message">
          Private note <span>Optional</span>
        </label>
        <textarea
          id="response-message"
          value={message}
          maxLength={2000}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Add a note for Neil…"
        />
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          className="premium-button premium-button--primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Recording…" : "Record response"}
        </button>
      </form>
    </div>
  );
}
