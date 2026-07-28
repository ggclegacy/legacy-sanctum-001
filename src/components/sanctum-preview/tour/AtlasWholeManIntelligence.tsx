"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import styles from "./atlas-whole-man-intelligence.module.css";

const atlasPhases = [
  {
    id: "observe",
    number: "01",
    verb: "Observing",
    detail: "Reading the member-controlled signal field",
  },
  {
    id: "connect",
    number: "02",
    verb: "Connecting",
    detail: "Mapping relationships across the whole man",
  },
  {
    id: "reason",
    number: "03",
    verb: "Reasoning",
    detail: "Building a transparent context chain",
  },
  {
    id: "guide",
    number: "04",
    verb: "Guiding",
    detail: "Turning context into a clear next decision",
  },
] as const;

const signalDomains = [
  { code: "VT", label: "Vitality", detail: "Sleep · recovery", value: "Live" },
  { code: "HM", label: "Hormones", detail: "Longitudinal", value: "Linked" },
  { code: "BW", label: "Bloodwork", detail: "Marker movement", value: "Linked" },
  { code: "PR", label: "Protocols", detail: "Adherence", value: "Active" },
  { code: "TR", label: "Training", detail: "Load · readiness", value: "Today" },
  { code: "MI", label: "Mindset", detail: "Decisions", value: "Context" },
  { code: "BR", label: "Brotherhood", detail: "Trusted circle", value: "Private" },
  { code: "SC", label: "Schedule", detail: "Demand", value: "High" },
  { code: "VS", label: "Vision", detail: "Priorities", value: "Aligned" },
  { code: "LG", label: "Legacy", detail: "Long horizon", value: "Protected" },
] as const;

const reasoningChain = [
  { signal: "Sleep window", value: "Shorter than baseline", relation: "Recovery margin" },
  { signal: "Schedule", value: "High decision demand", relation: "Cognitive load" },
  { signal: "Training", value: "Strength session planned", relation: "Physical load" },
  { signal: "Protocol", value: "On schedule", relation: "Continuity" },
  { signal: "Vision", value: "Key meeting today", relation: "Mission priority" },
] as const;

const guidance = [
  "Protect the recovery window",
  "Preserve the priority training stimulus",
  "Reduce avoidable decision complexity",
] as const;

const capabilities = [
  ["Tracks", "Continuously"],
  ["Connects", "Cross-domain"],
  ["Explains", "Why"],
  ["Anticipates", "Friction"],
  ["Member", "Decides"],
] as const;

export function AtlasWholeManIntelligence({
  firstName,
  active,
  speaking,
  reducedMotion,
}: {
  firstName: string;
  active: boolean;
  speaking: boolean;
  reducedMotion: boolean;
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const visiblePhaseIndex = reducedMotion ? 2 : phaseIndex;
  const phase = atlasPhases[visiblePhaseIndex];

  useEffect(() => {
    if (reducedMotion || !active) return;

    const timer = window.setInterval(() => {
      setPhaseIndex((current) => (current + 1) % atlasPhases.length);
    }, 4_600);

    return () => window.clearInterval(timer);
  }, [active, reducedMotion]);

  return (
    <section
      className={styles.experience}
      data-phase={phase.id}
      data-speaking={speaking}
      aria-label="Atlas whole-man intelligence demonstration"
    >
      <div className={styles.fieldGrid} aria-hidden="true" />
      <div className={styles.scanLine} aria-hidden="true" />

      <div className={`${styles.panel} ${styles.signalPanel}`}>
        <div className={styles.panelHeader}>
          <div>
            <span>Member signal field</span>
            <strong>10 systems connected</strong>
          </div>
          <div className={styles.liveState}>
            <i aria-hidden="true" />
            Member-controlled
          </div>
        </div>

        <div className={styles.signalMatrix}>
          {signalDomains.map((domain, index) => (
            <div
              className={styles.signal}
              data-emphasis={(index + visiblePhaseIndex) % 4 === 0}
              key={domain.code}
              style={{ "--signal-index": index } as CSSProperties}
            >
              <div className={styles.signalGlyph} aria-hidden="true">
                <i />
                <span>{domain.code}</span>
              </div>
              <div className={styles.signalName}>
                <strong>{domain.label}</strong>
                <small>{domain.detail}</small>
              </div>
              <span className={styles.signalValue}>{domain.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.ingestionBus} aria-hidden="true">
          <span>Encrypted context stream</span>
          <i />
          <b />
          <b />
          <b />
        </div>
      </div>

      <div className={styles.atlasTheatre}>
        <div className={styles.connectionField} aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <i
              key={index}
              style={{ "--spoke-index": index } as CSSProperties}
            />
          ))}
        </div>

        <div className={styles.atlasCore} aria-hidden="true">
          <div className={styles.outerOrbit}>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.neuralRing}>
            {Array.from({ length: 20 }, (_, index) => (
              <i
                key={index}
                style={{ "--node-index": index } as CSSProperties}
              />
            ))}
          </div>
          <div className={styles.voiceField}>
            {Array.from({ length: 24 }, (_, index) => (
              <i
                key={index}
                style={{ "--wave-index": index } as CSSProperties}
              />
            ))}
          </div>
          <div className={styles.coreMark}>
            <span>A</span>
            <small>Atlas</small>
          </div>
          <div className={styles.corePulse} />
        </div>

        <div className={styles.phaseReadout}>
          <div className={styles.phaseTopline}>
            <span>{phase.number} / 04</span>
            <i aria-hidden="true" />
            <strong>{speaking ? "Voice synchronized" : "Intelligence online"}</strong>
          </div>
          <h3>{phase.verb}</h3>
          <p>{phase.detail}</p>
          <div className={styles.phaseTrack} aria-hidden="true">
            {atlasPhases.map((item, index) => (
              <i
                data-state={index === visiblePhaseIndex ? "active" : "idle"}
                key={item.id}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.panel} ${styles.decisionPanel}`}>
        <div className={styles.panelHeader}>
          <div>
            <span>Transparent reasoning</span>
            <strong>Atlas decision field</strong>
          </div>
          <span className={styles.scenarioTag}>Simulated now</span>
        </div>

        <div className={styles.reasoningChain}>
          {reasoningChain.map((item, index) => (
            <div
              className={styles.reasoningStep}
              data-current={
                index === (visiblePhaseIndex + 1) % reasoningChain.length
              }
              key={item.signal}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{item.signal}</strong>
                <small>{item.value}</small>
              </div>
              <b>{item.relation}</b>
            </div>
          ))}
        </div>

        <div className={styles.atlasGuidance}>
          <div className={styles.guidanceLabel}>
            <span>Atlas guidance</span>
            <i aria-hidden="true" />
          </div>
          <h3>
            Protect today&apos;s mission
            <br />
            without borrowing from tomorrow.
          </h3>
          <div className={styles.guidanceList}>
            {guidance.map((item, index) => (
              <div key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className={styles.memberDecision}>
            <div>
              <span>Decision authority</span>
              <strong>{firstName}</strong>
            </div>
            <b>Member decides</b>
          </div>
        </div>
      </div>

      <div className={styles.capabilityRail}>
        {capabilities.map(([verb, detail], index) => (
          <div key={verb}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>
              <strong>{verb}</strong>
              <small>{detail}</small>
            </p>
          </div>
        ))}
      </div>

      <div className={styles.safetyLine}>
        <span>Private by design</span>
        <i aria-hidden="true" />
        <span>Transparent reasoning</span>
        <i aria-hidden="true" />
        <span>Never replaces physician or member judgment</span>
      </div>
    </section>
  );
}
