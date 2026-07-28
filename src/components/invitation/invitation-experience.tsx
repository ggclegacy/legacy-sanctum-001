"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { PostDemonstrationExperience } from "@/components/post-demonstration/PostDemonstrationExperience";
import { MemberAppPreview } from "@/components/preview/member-app-preview";
import { useAtlasNarration } from "@/hooks/useAtlasNarration";
import {
  SCENE_KEYS,
  type InvitationExperienceData,
  type NarrationPreference,
  type SceneKey,
} from "@/types/invitation";

import { EmblemStage } from "./emblem-stage";
import styles from "./invitation-premium.module.css";

const pillars = [
  {
    key: "vitality",
    index: "01",
    name: "Vitality",
    signal: "Capacity · Energy · Health",
    statement: "The strength, energy, and health required to carry the mission.",
  },
  {
    key: "mindset",
    index: "02",
    name: "Mindset",
    signal: "Clarity · Discipline · Resilience",
    statement: "The discipline, clarity, and resilience that direct the man.",
  },
  {
    key: "brotherhood",
    index: "03",
    name: "Brotherhood",
    signal: "Trust · Accountability · Access",
    statement:
      "The trusted relationships, accountability, and access that support the ascent.",
  },
  {
    key: "legacy",
    index: "04",
    name: "Legacy",
    signal: "Build · Protect · Endure",
    statement: "What he is building, protecting, and leaving behind.",
  },
] as const;

type InvitationExperienceProps = {
  data: InvitationExperienceData;
  preview?: boolean;
  trackingEnabled?: boolean;
  onExit?: () => void;
};

export function InvitationExperience({
  data,
  preview = false,
  trackingEnabled = false,
  onExit,
}: InvitationExperienceProps) {
  const [preference, setPreference] = useState<NarrationPreference | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneRevision, setSceneRevision] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const {
    status: narrationStatus,
    error: narrationError,
    muted: narrationMuted,
    hasAudio: narrationHasAudio,
    speak,
    pause,
    resume,
    toggleMuted,
    stop,
  } = useAtlasNarration();
  const reduceMotion = useReducedMotion();

  const sceneKey = SCENE_KEYS[sceneIndex];
  const hasEmbeddedNarration =
    sceneKey === "platform" || sceneKey === "founding";
  const narration = useMemo(
    () => data.narration.find((segment) => segment.sceneKey === sceneKey),
    [data.narration, sceneKey],
  );
  const hasAtlasNarration = useMemo(
    () => data.narration.some((segment) => Boolean(segment.script.trim())),
    [data.narration],
  );

  useEffect(() => {
    if (!preference) return;
    window.sessionStorage.setItem("sanctum-entry-mode", preference);
  }, [preference]);

  useEffect(() => {
    if (!preference || !trackingEnabled) return;
    void fetch("/api/invitations/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "scene_viewed",
        sceneKey,
      }),
    });
  }, [preference, sceneKey, trackingEnabled]);

  useEffect(() => {
    if (preference !== "atlas" || hasEmbeddedNarration) {
      stop();
      return;
    }

    if (narration?.script) {
      void speak(
        narration.script,
        `invitation:${sceneKey}:${sceneRevision}`,
      );
    }
  }, [
    narration?.script,
    hasEmbeddedNarration,
    preference,
    sceneKey,
    sceneRevision,
    speak,
    stop,
  ]);

  function choosePreference(next: NarrationPreference) {
    setPreference(next);
    if (next === "atlas" && narration?.script) {
      void speak(
        narration.script,
        `invitation:${sceneKey}:${sceneRevision}`,
      );
    } else {
      stop();
    }

    if (trackingEnabled) {
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
    setSceneRevision((value) => value + 1);
  }

  function togglePause() {
    if (narrationStatus === "playing") pause();
    else void resume();
  }

  if (!preference) {
    return (
      <main className={`sanctum-shell narration-shell ${styles.entryShell}`}>
        <div className="ambient-grid" aria-hidden="true" />
        <PremiumAtmosphere />
        <section
          className={`narration-card ${styles.entryCard}`}
          aria-labelledby="narration-title"
        >
          <div className="status-line">
            <span className="status-dot" />
            {preview ? "Preview access verified" : "Access verified"}
          </div>
          <div className={styles.entrySeal}>
            <EmblemStage compact priority />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <span>Private induction protocol</span>
          </div>
          <p className="eyebrow">Choose your entry</p>
          <h1 id="narration-title">How would you like to enter?</h1>
          <p>
            {hasAtlasNarration
              ? "Atlas narration is available. Captions remain active in either mode."
              : "The complete experience remains available through captions."}
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
          <div className={styles.entryAssurance}>
            <span>Private session</span>
            <i aria-hidden="true" />
            <span>Captions active</span>
            <i aria-hidden="true" />
            <span>Member controlled</span>
          </div>
        </section>
      </main>
    );
  }

  const showAudioControls =
    preference === "atlas" && !hasEmbeddedNarration;

  return (
    <main className={`experience-shell ${styles.experience}`}>
      <div className="ambient-grid" aria-hidden="true" />
      <PremiumAtmosphere />
      <header className={`experience-header ${styles.header}`}>
        <div className="experience-brand">
          <span className={styles.headerMark} aria-hidden="true">
            LS
          </span>
          <div className={styles.headerBrandCopy}>
            <span className="wordmark">Legacy Sanctum</span>
            <small>Private induction system</small>
          </div>
          {preview ? <span className="preview-mode-badge">Preview mode</span> : null}
        </div>
        <div className="experience-identity">
          <span className={styles.systemOnline}>
            <i aria-hidden="true" />
            Atlas linked
          </span>
          <span className="member-marker">
            {data.memberType} · {data.memberNumber}
          </span>
          {onExit ? (
            <button className="exit-experience" type="button" onClick={onExit}>
              Exit
            </button>
          ) : null}
        </div>
      </header>

      {sceneKey !== "founding" ? (
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
              data-state={
                index === sceneIndex
                  ? "active"
                  : index < sceneIndex
                    ? "complete"
                    : "upcoming"
              }
            />
          ))}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.section
          key={`${sceneKey}-${sceneRevision}`}
          className={`scene scene--${sceneKey} ${styles.scene}`}
          data-premium-scene={sceneKey}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
          transition={{
            duration: reduceMotion ? 0 : 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-live="polite"
        >
          {sceneKey !== "founding" ? (
            <>
              <div className={styles.sceneFrame} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className={styles.sceneTelemetry} aria-hidden="true">
                <span>LS / {sceneKey}</span>
                <i />
                <span>{String(sceneIndex + 1).padStart(2, "0")} of 09</span>
              </div>
            </>
          ) : null}
          <SceneContent
            sceneKey={sceneKey}
            data={data}
            preview={preview}
            persistResponse={trackingEnabled}
            narrationEnabled={preference === "atlas"}
            submitted={submitted}
            onSubmitted={() => setSubmitted(true)}
            onContinue={() => goToScene(sceneIndex + 1)}
            onReturnToInvitation={() => goToScene(0)}
          />
        </motion.section>
      </AnimatePresence>

      {sceneKey !== "founding" ? (
        <div
          className={`caption-region ${styles.captionRegion}`}
          aria-live="polite"
        >
        <div className={styles.voiceSignal} aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <span>
          {preference === "atlas"
              ? sceneKey === "platform"
              ? "Atlas demonstration"
              : `Atlas · ${narrationStatus}`
            : "Silent mode"}
        </span>
        <p>
          {narration?.script ??
            "Approved narration has not been published for this scene. The complete message remains on screen."}
        </p>
        {narrationError && sceneKey !== "platform" ? (
          <small className="caption-region__error" role="alert">
            {narrationError}
          </small>
        ) : null}
        </div>
      ) : null}

      {sceneKey !== "founding" ? (
        <footer className={`scene-controls ${styles.controls}`}>
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
                disabled={!narrationHasAudio}
              >
                {narrationStatus === "playing" ? "Pause" : "Resume"}
              </button>
              <button
                className="control-button"
                type="button"
                onClick={toggleMuted}
              >
                {narrationMuted ? "Unmute" : "Mute"}
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
      ) : null}

    </main>
  );
}

function SceneContent({
  sceneKey,
  data,
  preview,
  persistResponse,
  narrationEnabled,
  submitted,
  onSubmitted,
  onContinue,
  onReturnToInvitation,
}: {
  sceneKey: SceneKey;
  data: InvitationExperienceData;
  preview: boolean;
  persistResponse: boolean;
  narrationEnabled: boolean;
  submitted: boolean;
  onSubmitted: () => void;
  onContinue: () => void;
  onReturnToInvitation: () => void;
}) {
  switch (sceneKey) {
    case "recognition":
      return (
        <div className={`scene-centered ${styles.recognitionScene}`}>
          <div className={styles.recognitionSeal}>
            <EmblemStage compact />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <span>{data.memberNumber}</span>
          </div>
          <div className={styles.recognitionCopy}>
            <p className="eyebrow">Access recognized</p>
            <h1>Welcome, {data.firstName}.</h1>
            <p className="member-designation">
              {data.memberType} <span>·</span> {data.memberNumber}
            </p>
            {data.customHeadline ? (
              <p className="scene-lede">{data.customHeadline}</p>
            ) : null}
            <div className={styles.recognitionStatus}>
              <span>Identity confirmed</span>
              <span>Invitation active</span>
              <span>Atlas ready</span>
            </div>
          </div>
        </div>
      );
    case "founder":
      return (
        <div className={`editorial-scene ${styles.founderScene}`}>
          <div className={styles.founderRail}>
            <span>01</span>
            <i aria-hidden="true" />
            <small>Founder transmission</small>
          </div>
          <div className={styles.founderMessage}>
            <p className="scene-index">01 / A message from the founder</p>
            <span className={styles.quoteMark} aria-hidden="true">
              “
            </span>
            <blockquote>{data.founderMessage}</blockquote>
            <div className={styles.signatureLockup}>
              <p className="signature">— Neil</p>
              <span>Founder · Legacy Sanctum</span>
            </div>
          </div>
        </div>
      );
    case "selection":
      return (
        <div className={`editorial-scene ${styles.selectionScene}`}>
          <div className={styles.selectionCopy}>
            <p className="scene-index">02 / Selected with intention</p>
            <h2>This invitation was created for you.</h2>
            <p className="scene-body">{data.whySelected}</p>
            <div className={styles.selectionSignals}>
              <span>Leadership</span>
              <span>Responsibility</span>
              <span>Standard</span>
            </div>
          </div>
          <SelectionCompass memberNumber={data.memberNumber} />
        </div>
      );
    case "pillars":
      return (
        <div className={`pillars-scene ${styles.pillarsScene}`}>
          <div className={`scene-heading ${styles.sceneHeading}`}>
            <p className="scene-index">03 / The foundation</p>
            <h2>Four disciplines. One enduring man.</h2>
            <p>
              A complete operating philosophy for the strength, judgment,
              relationships, and work that define a man’s long horizon.
            </p>
          </div>
          <div className={`pillar-grid ${styles.pillarGrid}`}>
            {pillars.map((pillar) => (
              <article
                className={`pillar-card ${styles.pillarCard}`}
                data-pillar={pillar.key}
                key={pillar.name}
              >
                <div className={styles.pillarTopline}>
                  <span>{pillar.index}</span>
                  <small>{pillar.signal}</small>
                </div>
                <PillarArtifact pillar={pillar.key} />
                <div className={styles.pillarCopy}>
                  <h3>{pillar.name}</h3>
                  <p>{pillar.statement}</p>
                </div>
                <div className={styles.pillarEnergy} aria-hidden="true">
                  <i />
                </div>
              </article>
            ))}
          </div>
          <div className={styles.pillarUnifier}>
            <span>Vitality</span>
            <i />
            <span>Mindset</span>
            <i />
            <span>Brotherhood</span>
            <i />
            <span>Legacy</span>
          </div>
        </div>
      );
    case "products":
      return (
        <div className={`products-scene ${styles.productsScene}`}>
          <div className={`scene-heading ${styles.productsHeading}`}>
            <p className="scene-index">04 / Selected for your box</p>
            <h2>Tools for the work ahead.</h2>
            <div className={styles.collectionMeta}>
              <span>
                <strong>{String(data.products.length).padStart(2, "0")}</strong>
                selected protocols
              </span>
              <i aria-hidden="true" />
              <span>Founding collection · private issue</span>
            </div>
          </div>
          {data.products.length ? (
            <div className={`product-list ${styles.productGrid}`}>
              {data.products.map((product, index) => (
                <article
                  className={`product-card ${styles.productCard}`}
                  data-product={product.id}
                  key={product.id}
                >
                  <div className={styles.productArtifactStage}>
                    <ProductArtifact productId={product.id} />
                    <span className={styles.productIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <small>Selected for {data.firstName}</small>
                  </div>
                  <div className={styles.productCopy}>
                    <p className="micro-label">{product.shortPurpose}</p>
                    <h3>{product.name}</h3>
                    <p>{product.selectionReason}</p>
                    {product.usageNote ? (
                      <small>{product.usageNote}</small>
                    ) : null}
                  </div>
                  <div className={styles.productSignal} aria-hidden="true">
                    {Array.from({ length: 12 }, (_, signalIndex) => (
                      <i key={signalIndex} />
                    ))}
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
        <div className="platform-scene platform-scene--immersive">
          <MemberAppPreview
            firstName={data.firstName}
            fullName={data.displayName}
            memberNumber={data.memberNumber}
            memberType={data.memberType}
            narrationEnabled={narrationEnabled}
            onReturnToInvitation={onContinue}
          />
        </div>
      );
    case "founding":
      return (
        <PostDemonstrationExperience
          data={data}
          narrationEnabled={narrationEnabled}
          trackingEnabled={persistResponse}
          onReturnToInvitation={onReturnToInvitation}
        />
      );
    case "response":
      return (
        <ResponseScene
          preview={preview}
          persistResponse={persistResponse}
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

function PremiumAtmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      <i />
      <i />
      <i />
      <span />
    </div>
  );
}

function SelectionCompass({ memberNumber }: { memberNumber: string }) {
  return (
    <div className={styles.selectionCompass} aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
      <b />
      <div>
        <span>{memberNumber}</span>
        <strong>Selected</strong>
        <small>with intention</small>
      </div>
    </div>
  );
}

function PillarArtifact({ pillar }: { pillar: (typeof pillars)[number]["key"] }) {
  return (
    <div className={styles.pillarArtifact} data-artifact={pillar} aria-hidden="true">
      <div className={styles.artifactRings}>
        <i />
        <i />
        <i />
      </div>
      <div className={styles.physicalArtifact}>
        {pillar === "vitality" ? (
          <div className={styles.vitalityHeart}>
            <div className={styles.heartBody}>
              <i />
              <i />
            </div>
            <div className={styles.heartSignal}>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <span>Living capacity</span>
          </div>
        ) : pillar === "mindset" ? (
          <div className={styles.mindsetCompass}>
            <div className={styles.compassCase}>
              <i />
              <i />
              <b />
              <span />
            </div>
            <small>N</small>
            <em>True direction</em>
          </div>
        ) : pillar === "brotherhood" ? (
          <div className={styles.brotherhoodCircle}>
            <div className={styles.memberFigure}><i /></div>
            <div className={styles.memberFigure}><i /></div>
            <div className={styles.memberFigure}><i /></div>
            <b />
            <span>Bound by standard</span>
          </div>
        ) : (
          <div className={styles.legacyMonument}>
            <div className={styles.monumentCrown}><i /></div>
            <div className={styles.monumentColumn}>
              <i />
              <i />
              <i />
            </div>
            <div className={styles.monumentFoundation}>
              <i />
              <i />
              <i />
            </div>
            <span>Built to endure</span>
          </div>
        )}
      </div>
      <div className={styles.artifactFloor}><i /></div>
    </div>
  );
}

function ProductArtifact({ productId }: { productId: string }) {
  const artifact =
    productId === "fortius-aqua"
      ? "aqua"
      : productId === "restoria"
        ? "restoria"
        : "nexus";

  return (
    <div
      className={styles.productArtifact}
      data-artifact={artifact}
      aria-hidden="true"
    >
      <div className={styles.productOrbit}>
        <i />
        <i />
      </div>
      <div className={styles.productCore}>
        <i />
        <i />
        <span>
          {artifact === "aqua" ? "A" : artifact === "restoria" ? "R" : "N"}
        </span>
      </div>
      <div className={styles.productParticles}>
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function ResponseScene({
  preview,
  persistResponse,
  submitted,
  onSubmitted,
}: {
  preview: boolean;
  persistResponse: boolean;
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

    if (preview || !persistResponse) {
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
        <h2>
          {persistResponse ? "Your intention has been recorded." : "Your intention is clear."}
        </h2>
        <p>
          {persistResponse
            ? "Continue to close your private entry experience."
            : preview
              ? "Preview responses are never saved."
              : "Response saving will activate when this live invitation is connected."}
        </p>
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
