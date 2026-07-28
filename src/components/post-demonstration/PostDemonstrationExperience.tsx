"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";

import {
  defaultSmsTemplate,
  foundingPrivileges,
  memberNextSteps,
  postDemonstrationNarration,
  resolveProductPillar,
  type PostDemonstrationStage,
} from "@/data/post-demonstration/bridge-data";
import { useAtlasNarration } from "@/hooks/useAtlasNarration";
import { usePostDemonstration } from "@/hooks/usePostDemonstration";
import { useSmsLaunch } from "@/hooks/useSmsLaunch";
import { renderMessageTemplate } from "@/lib/messaging/message-template";
import type { InvitationExperienceData } from "@/types/invitation";

import styles from "./post-demonstration.module.css";

type BridgeEvent =
  | "post_demonstration_started"
  | "founding_member_revealed"
  | "founding_privilege_opened"
  | "member_product_viewed"
  | "next_steps_viewed"
  | "founder_message_viewed"
  | "confirm_place_tapped"
  | "sms_launch_attempted"
  | "sms_fallback_shown"
  | "post_demonstration_completed";

const stageLabels: Record<PostDemonstrationStage, string> = {
  transition: "Demonstration complete",
  debrief: "The direction",
  "member-reveal": "Your designation",
  "founding-position": "Founding position",
  "product-connection": "The first expression",
  "next-steps": "What happens next",
  "founder-message": "From the founder",
  "final-induction": "Your decision",
  "sms-ready": "Message ready",
};

export function PostDemonstrationExperience({
  data,
  narrationEnabled,
  trackingEnabled,
  onReturnToInvitation,
}: {
  data: InvitationExperienceData;
  narrationEnabled: boolean;
  trackingEnabled: boolean;
  onReturnToInvitation: () => void;
}) {
  const bridge = usePostDemonstration();
  const {
    status: narrationStatus,
    error: narrationError,
    hasAudio,
    speak,
    pause,
    resume,
    replay,
    stop,
  } = useAtlasNarration();
  const trackedStagesRef = useRef(new Set<PostDemonstrationStage>());

  const tokens = useMemo(
    () => ({
      firstName: data.firstName,
      fullName: data.displayName,
      memberNumber: data.memberNumber,
    }),
    [data.displayName, data.firstName, data.memberNumber],
  );
  const narration = renderMessageTemplate(
    postDemonstrationNarration[bridge.stage],
    tokens,
  );
  const message = renderMessageTemplate(
    data.smsTemplate ?? defaultSmsTemplate,
    tokens,
  );

  const track = useCallback(
    (eventType: BridgeEvent) => {
      if (!trackingEnabled) return;
      void fetch("/api/invitations/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, sceneKey: "founding" }),
      });
    },
    [trackingEnabled],
  );

  const handleSmsFallback = useCallback(() => {
    bridge.showSmsFallback();
    track("sms_fallback_shown");
  }, [bridge, track]);
  const sms = useSmsLaunch({
    phoneNumber: data.founderPhoneNumber ?? null,
    message,
    onFallback: handleSmsFallback,
  });

  useEffect(() => {
    if (!narrationEnabled) {
      stop();
      return;
    }
    void speak(
      narration,
      `post-demonstration:${bridge.stage}:${bridge.narrationRevision}`,
    );
  }, [
    bridge.narrationRevision,
    bridge.stage,
    narration,
    narrationEnabled,
    speak,
    stop,
  ]);

  useEffect(() => {
    if (trackedStagesRef.current.has(bridge.stage)) return;
    trackedStagesRef.current.add(bridge.stage);
    const eventByStage: Partial<Record<PostDemonstrationStage, BridgeEvent>> = {
      transition: "post_demonstration_started",
      "member-reveal": "founding_member_revealed",
      "next-steps": "next_steps_viewed",
      "founder-message": "founder_message_viewed",
    };
    const event = eventByStage[bridge.stage];
    if (event) track(event);
  }, [bridge.stage, track]);

  useEffect(() => {
    if (bridge.stage !== "transition" && bridge.stage !== "debrief") return;
    if (narrationEnabled && narrationStatus !== "ended" && narrationStatus !== "error") {
      return;
    }
    const delay = narrationEnabled ? 900 : bridge.stage === "transition" ? 2400 : 4600;
    const timer = window.setTimeout(bridge.advance, delay);
    return () => window.clearTimeout(timer);
  }, [
    bridge.advance,
    bridge.stage,
    narrationEnabled,
    narrationStatus,
  ]);

  const handleConfirm = useCallback(() => {
    if (bridge.smsLaunchAttempted || sms.launching) return;
    track("confirm_place_tapped");
    track("sms_launch_attempted");
    bridge.markSmsLaunchAttempted();
    bridge.goToStage("sms-ready");
    sms.launch();
  }, [bridge, sms, track]);

  const handleReturn = useCallback(() => {
    track("post_demonstration_completed");
    stop();
    onReturnToInvitation();
  }, [onReturnToInvitation, stop, track]);

  return (
    <section className={styles.bridge} data-stage={bridge.stage}>
      <div className={styles.atmosphere} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className={styles.bridgeHeader}>
        <div>
          <span className={styles.kicker}>Legacy Sanctum</span>
          <strong>{stageLabels[bridge.stage]}</strong>
        </div>
        <div className={styles.stageProgress} aria-label="Bridge progress">
          {Array.from({ length: bridge.stageCount }, (_, index) => (
            <i
              key={index}
              data-active={index <= bridge.stageIndex ? "true" : "false"}
            />
          ))}
        </div>
      </header>

      <div className={styles.stage}>
        {bridge.stage === "transition" ? (
          <CeremonialSeal
            eyebrow="Atlas demonstration"
            title="Demonstration complete."
            memberNumber={data.memberNumber}
          />
        ) : null}

        {bridge.stage === "debrief" ? (
          <div className={styles.debrief}>
            <CeremonialSeal memberNumber={data.memberNumber} compact />
            <p className={styles.eyebrow}>The direction of Legacy Sanctum</p>
            <h2>What you have seen is the direction.</h2>
            <p>Not the finished platform.</p>
            <div className={styles.debriefLine}>
              <span>Vision established</span>
              <i />
              <span>Founding phase active</span>
            </div>
          </div>
        ) : null}

        {bridge.stage === "member-reveal" ? (
          <div className={styles.memberReveal}>
            <p className={styles.eyebrow}>Selected intentionally</p>
            <span className={styles.ghostNumber}>{data.memberNumber}</span>
            <div className={styles.memberSeal}>
              <span>{data.memberNumber}</span>
              <i />
              <i />
            </div>
            <h2>{data.displayName}</h2>
            <p className={styles.designation}>{data.memberType}</p>
            <p className={styles.lede}>
              You were not invited simply to observe what is being built. You
              were selected to be among the first men inside it.
            </p>
            <button className={styles.primaryAction} onClick={bridge.advance} type="button">
              Understand My Place
            </button>
          </div>
        ) : null}

        {bridge.stage === "founding-position" ? (
          <div className={styles.contentStage}>
            <StageHeading
              index="01"
              eyebrow="Your place in the Sanctum"
              title="Founding membership is a position."
              body="Open each founding privilege to understand what your position means."
            />
            <div className={styles.privilegeGrid}>
              {foundingPrivileges.map((privilege) => {
                const open = bridge.openedPrivilegeIds.includes(privilege.id);
                return (
                  <button
                    className={styles.privilege}
                    data-open={open ? "true" : "false"}
                    key={privilege.id}
                    onClick={() => {
                      if (!open) track("founding_privilege_opened");
                      bridge.openPrivilege(privilege.id);
                    }}
                    type="button"
                    aria-expanded={open}
                  >
                    <span className={styles.privilegeNumber}>{privilege.number}</span>
                    <span>
                      <small>{privilege.shortLabel}</small>
                      <strong>{privilege.title}</strong>
                    </span>
                    <span className={styles.revealGlyph}>{open ? "—" : "+"}</span>
                    {open ? (
                      <span className={styles.privilegeDetail}>
                        {privilege.description}
                        <em>{privilege.atlasResponse}</em>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              className={styles.primaryAction}
              disabled={bridge.openedPrivilegeIds.length !== foundingPrivileges.length}
              onClick={bridge.advance}
              type="button"
            >
              Continue to My Collection
            </button>
          </div>
        ) : null}

        {bridge.stage === "product-connection" ? (
          <div className={styles.contentStage}>
            <StageHeading
              index="02"
              eyebrow="The first physical expression"
              title="The products are the beginning."
              body="Your founding collection connects the physical ritual in your hands to the wider system being built."
            />
            {data.products.length ? (
              <>
                <div className={styles.productSelector} role="tablist" aria-label="Member products">
                  {data.products.map((product, index) => (
                    <button
                      key={product.id}
                      role="tab"
                      aria-selected={index === bridge.selectedProductIndex}
                      onClick={() => {
                        if (!bridge.viewedProductIds.includes(product.id)) {
                          track("member_product_viewed");
                        }
                        bridge.viewProduct(product.id, index);
                      }}
                      type="button"
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {product.name}
                    </button>
                  ))}
                </div>
                {data.products[bridge.selectedProductIndex] ? (
                  <article className={styles.productFeature}>
                    <div className={styles.productOrb} aria-hidden="true">
                      <span>
                        {data.products[bridge.selectedProductIndex].name.slice(0, 1)}
                      </span>
                      <i />
                      <i />
                    </div>
                    <div>
                      <p className={styles.eyebrow}>
                        {resolveProductPillar(data.products[bridge.selectedProductIndex])} pillar
                      </p>
                      <h3>{data.products[bridge.selectedProductIndex].name}</h3>
                      <strong>{data.products[bridge.selectedProductIndex].shortPurpose}</strong>
                      <p>{data.products[bridge.selectedProductIndex].selectionReason}</p>
                      <small>Selected for {data.firstName} · Founding collection</small>
                    </div>
                  </article>
                ) : null}
              </>
            ) : (
              <p className={styles.emptyState}>Your private collection will be connected here.</p>
            )}
            <button className={styles.primaryAction} onClick={bridge.advance} type="button">
              See What Happens Next
            </button>
          </div>
        ) : null}

        {bridge.stage === "next-steps" ? (
          <div className={styles.contentStage}>
            <StageHeading
              index="03"
              eyebrow="The path forward"
              title="Nothing more is required tonight."
              body="The next chapter unfolds deliberately."
            />
            <div className={styles.timeline}>
              {memberNextSteps.map((step) => (
                <article key={step.id}>
                  <span>{step.number}</span>
                  <div>
                    <small>{step.label}</small>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <button className={styles.primaryAction} onClick={bridge.advance} type="button">
              Continue
            </button>
          </div>
        ) : null}

        {bridge.stage === "founder-message" ? (
          <div className={styles.founderStage}>
            <div className={styles.founderRail}>
              <span>04</span>
              <i />
              <small>Personal transmission</small>
            </div>
            <div className={styles.founderNote}>
              <p className={styles.eyebrow}>One final message from the founder</p>
              <blockquote>
                {data.postDemonstrationFounderMessage ?? data.founderMessage}
              </blockquote>
              <span>Founder · Legacy Sanctum</span>
              <button className={styles.primaryAction} onClick={bridge.advance} type="button">
                Return to Atlas
              </button>
            </div>
          </div>
        ) : null}

        {bridge.stage === "final-induction" ? (
          <div className={styles.finalInduction}>
            <CeremonialSeal memberNumber={data.memberNumber} compact />
            <p className={styles.eyebrow}>Founding position · {data.memberNumber}</p>
            <h2>Your invitation has been delivered.</h2>
            <p>Your position has been reserved.</p>
            <strong>The final decision is yours.</strong>
            <button
              className={`${styles.primaryAction} ${styles.confirmAction}`}
              disabled={bridge.smsLaunchAttempted || sms.launching}
              onClick={handleConfirm}
              type="button"
            >
              {sms.launching ? "Opening Messages…" : "Confirm My Place"}
            </button>
            <small>Opens a prepared text in your native Messages app. You choose whether to send it.</small>
          </div>
        ) : null}

        {bridge.stage === "sms-ready" ? (
          <div className={styles.smsReady}>
            <div className={styles.readyMark} aria-hidden="true">✓</div>
            <p className={styles.eyebrow}>Your message is ready</p>
            <h2>Review it. The final send remains yours.</h2>
            <p className={styles.smsStatus} role="status">
              {sms.status || "A private confirmation has been prepared in Messages."}
            </p>
            <label>
              Prepared message
              <textarea readOnly value={message} rows={7} />
            </label>
            {bridge.smsFallbackVisible ? (
              <p className={styles.fallbackNote}>
                Messages did not open automatically. Copy the prepared text or try opening Messages again.
              </p>
            ) : null}
            <div className={styles.smsActions}>
              <button className={styles.primaryAction} onClick={sms.copyMessage} type="button">
                {sms.copied ? "Message Copied" : "Copy Message"}
              </button>
              <button
                className={styles.secondaryAction}
                disabled={sms.launching}
                onClick={() => {
                  track("sms_launch_attempted");
                  sms.launch();
                }}
                type="button"
              >
                Open Messages
              </button>
              <button className={styles.textAction} onClick={handleReturn} type="button">
                Return to Invitation
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <footer className={styles.atlasBar}>
        <div className={styles.voiceWave} aria-hidden="true">
          {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
        </div>
        <div className={styles.caption}>
          <span>Atlas · {narrationEnabled ? narrationStatus : "captions"}</span>
          {bridge.captionsVisible ? <p>{narration}</p> : null}
          {narrationError ? <small role="alert">{narrationError}</small> : null}
        </div>
        <div className={styles.audioControls}>
          {narrationEnabled ? (
            <>
              <button
                disabled={!hasAudio}
                onClick={narrationStatus === "playing" ? pause : () => void resume()}
                type="button"
              >
                {narrationStatus === "playing" ? "Pause" : "Resume"}
              </button>
              <button onClick={() => void replay()} type="button">Replay</button>
            </>
          ) : null}
          <button onClick={bridge.toggleCaptions} type="button">
            {bridge.captionsVisible ? "Hide captions" : "Show captions"}
          </button>
        </div>
      </footer>
    </section>
  );
}

function StageHeading({
  index,
  eyebrow,
  title,
  body,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <header className={styles.stageHeading}>
      <span>{index}</span>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </header>
  );
}

function CeremonialSeal({
  eyebrow,
  title,
  memberNumber,
  compact = false,
}: {
  eyebrow?: string;
  title?: string;
  memberNumber: string;
  compact?: boolean;
}) {
  return (
    <div className={styles.ceremonialSeal} data-compact={compact ? "true" : "false"}>
      <div className={styles.sealStage}>
        <i />
        <i />
        <Image src="/icon.png" alt="" width={180} height={180} priority />
        <span>{memberNumber}</span>
      </div>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      {title ? <h2>{title}</h2> : null}
    </div>
  );
}
