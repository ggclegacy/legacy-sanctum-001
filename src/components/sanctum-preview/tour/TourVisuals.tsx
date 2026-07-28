"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import type { PlatformTourChapterId } from "@/data/preview/platform-tour";

import styles from "./continuous-atlas-tour.module.css";

export function TourVisual({
  chapterId,
  firstName,
  reducedMotion,
}: {
  chapterId: PlatformTourChapterId;
  firstName: string;
  reducedMotion: boolean;
}) {
  const content = {
    "command-center": <CommandCenter firstName={firstName} />,
    vitality: <VitalitySystem />,
    hormones: <HormoneTracking />,
    bloodwork: <BloodworkIntelligence />,
    protocols: <ProtocolStewardship />,
    training: <TrainingPerformance />,
    "atlas-intelligence": <AtlasIntelligence />,
    mindset: <MindsetGrowth />,
    brotherhood: <BrotherhoodNetwork />,
    vision: <VisionGrowth />,
    "legacy-vault": <LegacyVault />,
    "integrated-system": <IntegratedSystem />,
  }[chapterId];

  return (
    <motion.div
      className={styles.visual}
      data-chapter={chapterId}
      initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.7 }}
    >
      <div className={styles.visualAtmosphere} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className={styles.visualTelemetry} aria-hidden="true">
        <span>LS / {chapterId.replaceAll("-", " ")}</span>
        <i />
        <span>Live model</span>
      </div>
      {content}
    </motion.div>
  );
}

function Panel({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${styles.panel} ${className}`}>
      <div className={styles.panelSheen} aria-hidden="true" />
      <div className={styles.panelLabel}>
        <span>{label}</span>
        <i aria-hidden="true" />
        <b aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function CommandCenter({ firstName }: { firstName: string }) {
  return (
    <div className={styles.commandGrid}>
      <Panel label="Atlas briefing" className={styles.commandBriefing}>
        <span className={styles.microLabel}>Good morning, {firstName}</span>
        <h3>Protect the recovery window.</h3>
        <p>
          The modeled day carries higher demand. Atlas has simplified the
          evening and moved hydration forward.
        </p>
        <div className={styles.commandSignals}>
          <span>03 connected signals</span>
          <span>01 priority shift</span>
          <span>Context reviewed</span>
        </div>
        <div className={styles.commandPulse} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>Atlas priority locked</span>
        </div>
      </Panel>

      <Panel label="Today’s direction" className={styles.directionPanel}>
        {[
          ["01", "Clarity", "Protect the first decision window"],
          ["02", "Vitality", "Move hydration earlier"],
          ["03", "Legacy", "Advance the founder objective"],
        ].map(([number, label, detail]) => (
          <div className={styles.directionRow} key={label}>
            <span>{number}</span>
            <div>
              <strong>{label}</strong>
              <small>{detail}</small>
            </div>
            <i aria-hidden="true" />
          </div>
        ))}
      </Panel>

      <Panel label="Four-pillar state" className={styles.pillarState}>
        {[
          ["Vitality", "Protected"],
          ["Mindset", "Focused"],
          ["Brotherhood", "2 signals"],
          ["Legacy", "Advancing"],
        ].map(([label, value], index) => (
          <div key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <small>{value}</small>
          </div>
        ))}
      </Panel>

      <Panel label="Operating horizon" className={styles.horizonPanel}>
        <div className={styles.horizonTrack}>
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.horizonLabels}>
          <span>Now</span>
          <span>30 days</span>
          <span>Quarter</span>
          <span>Legacy</span>
        </div>
        <strong>Daily actions remain connected to the long horizon.</strong>
      </Panel>
    </div>
  );
}

function VitalitySystem() {
  return (
    <div className={styles.vitalityGrid}>
      <Panel label="Vitality state" className={styles.vitalityCorePanel}>
        <div className={styles.vitalityCore}>
          <div>
            <span>Today</span>
            <strong>Protected</strong>
            <small>Contextual state</small>
          </div>
          {["Sleep", "Recovery", "Movement", "Stress"].map(
            (signal, index) => (
              <span
                className={styles[`orbitSignal${index + 1}`]}
                key={signal}
              >
                <i aria-hidden="true" />
                <b>{signal}</b>
              </span>
            ),
          )}
          <span className={styles.vitalityWave} aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} />
            ))}
          </span>
        </div>
      </Panel>
      <Panel label="Connected signals" className={styles.signalMatrix}>
        {[
          ["Sleep rhythm", "Within baseline", 76],
          ["Recovery margin", "Protected", 62],
          ["Movement load", "Balanced", 82],
          ["Stress context", "Elevated demand", 54],
        ].map(([label, value, width]) => (
          <div className={styles.signalRow} key={String(label)}>
            <div>
              <strong>{label}</strong>
              <small>{value}</small>
            </div>
            <span>
              <i style={{ width: `${width}%` }} />
            </span>
          </div>
        ))}
      </Panel>
      <Panel label="Atlas relationship" className={styles.insightPanel}>
        <span className={styles.microLabel}>Simulated insight</span>
        <h3>Sleep changes the behavior of the whole system.</h3>
        <p>
          Recovery, decision margin, training demand, and evening protection
          are reviewed together.
        </p>
        <div className={styles.relationshipChain}>
          <span>Sleep</span>
          <i />
          <span>Recovery</span>
          <i />
          <span>Protocol</span>
        </div>
      </Panel>
    </div>
  );
}

function HormoneTracking() {
  const markers = [
    ["Total testosterone", "Stable direction", [28, 34, 31, 38, 41, 45], "T"],
    [
      "Free testosterone",
      "Review with clinician",
      [42, 38, 44, 40, 36, 39],
      "FT",
    ],
    ["Thyroid context", "Within reference", [31, 33, 34, 35, 35, 36], "TH"],
    ["Cortisol pattern", "Context requested", [48, 43, 52, 46, 41, 44], "C"],
  ] as const;

  return (
    <div className={styles.hormoneGrid}>
      <Panel label="Hormone timeline" className={styles.hormoneTimeline}>
        <div className={styles.hormoneHero}>
          <div className={styles.hormoneOrb} aria-hidden="true">
            <i />
            <i />
            <i />
            <span>H</span>
          </div>
          <div>
            <span className={styles.microLabel}>Longitudinal intelligence</span>
            <h3>Four systems. One living timeline.</h3>
            <p>
              Marker movement is connected to symptoms, protocol history, and
              care-team context.
            </p>
          </div>
          <div className={styles.hormoneStatus}>
            <span>04</span>
            <small>active marker groups</small>
          </div>
        </div>
        <div className={styles.markerHeader}>
          <span>Illustrative marker</span>
          <span>Longitudinal view</span>
          <span>Care context</span>
        </div>
        {markers.map(([label, context, values, code]) => (
          <div className={styles.markerRow} key={label}>
            <b className={styles.markerCode}>{code}</b>
            <div>
              <strong>{label}</strong>
              <small>{context}</small>
            </div>
            <div className={styles.sparkBars} aria-label={`${label} demo trend`}>
              {values.map((height, index) => (
                <i
                  key={`${label}-${index}`}
                  style={{ height: `${height}%` }}
                >
                  <span />
                </i>
              ))}
              <b aria-hidden="true" />
            </div>
            <span>
              <i aria-hidden="true" />
              Clinician
            </span>
          </div>
        ))}
      </Panel>
      <Panel label="Context layer" className={styles.hormoneContext}>
        <div className={styles.contextStack}>
          <span>Lab history</span>
          <span>Symptoms & notes</span>
          <span>Protocol history</span>
          <span>Care-team review</span>
        </div>
        <div className={styles.contextCore}>
          <div className={styles.contextOrbit} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <strong>One longitudinal record</strong>
          <small>No automated diagnosis</small>
        </div>
        <div className={styles.contextHandshake}>
          <span>Member record</span>
          <i aria-hidden="true" />
          <span>Care team</span>
        </div>
      </Panel>
    </div>
  );
}

function BloodworkIntelligence() {
  return (
    <div className={styles.labGrid}>
      <Panel label="Bloodwork intelligence" className={styles.labOverview}>
        <div className={styles.labHeader}>
          <div>
            <span className={styles.microLabel}>Latest illustrative panel</span>
            <h3>Meaningful movement surfaced first.</h3>
          </div>
          <span className={styles.reviewBadge}>Ready for review</span>
        </div>
        <div className={styles.labCategories}>
          {[
            ["Metabolic", "Stable", 68],
            ["Inflammation", "Improving", 82],
            ["Nutrients", "Attention", 48],
            ["Cardiovascular", "Stable", 72],
          ].map(([label, state, width]) => (
            <div key={String(label)}>
              <span>
                <strong>{label}</strong>
                <small>{state}</small>
              </span>
              <i>
                <b style={{ width: `${width}%` }} />
              </i>
            </div>
          ))}
        </div>
        <div className={styles.labSpectrum} aria-hidden="true">
          {Array.from({ length: 22 }, (_, index) => (
            <i key={index} />
          ))}
          <span />
        </div>
      </Panel>
      <Panel label="Atlas change log" className={styles.changeLog}>
        {[
          ["Vitamin D", "Direction declined across two tests", "Review"],
          ["Ferritin", "Direction improved", "Context"],
          ["ApoB", "Holding near personal baseline", "Stable"],
        ].map(([marker, change, state]) => (
          <div key={marker}>
            <i aria-hidden="true" />
            <span>
              <strong>{marker}</strong>
              <small>{change}</small>
            </span>
            <b>{state}</b>
          </div>
        ))}
        <p>
          Atlas prepares context and questions. A qualified clinician interprets
          results.
        </p>
      </Panel>
    </div>
  );
}

function ProtocolStewardship() {
  return (
    <div className={styles.protocolGrid}>
      <Panel label="Today’s protocol" className={styles.protocolTimeline}>
        {[
          ["06:30", "Hydration & morning foundation", "Complete", "done"],
          ["08:00", "Clinician-directed therapy", "Logged", "done"],
          ["12:30", "Midday protocol", "Upcoming", "active"],
          ["17:30", "Training preparation", "Adjusted", "shift"],
          ["21:00", "Recovery & sleep protection", "Priority", "priority"],
        ].map(([time, title, state, mode]) => (
          <div className={styles.protocolRow} data-mode={mode} key={time}>
            <span>{time}</span>
            <i aria-hidden="true" />
            <div>
              <strong>{title}</strong>
              <small>{state}</small>
            </div>
          </div>
        ))}
      </Panel>
      <Panel label="Peptide stewardship" className={styles.peptidePanel}>
        <span className={styles.safetyFlag}>Clinician managed</span>
        <div className={styles.protocolSeal} aria-hidden="true">
          <i />
          <i />
          <span>Verified</span>
        </div>
        <h3>Peptide protocol record</h3>
        <div className={styles.peptideRecord}>
          <div>
            <span>Care plan</span>
            <strong>Linked</strong>
          </div>
          <div>
            <span>Schedule</span>
            <strong>Tracked</strong>
          </div>
          <div>
            <span>Member log</span>
            <strong>Current</strong>
          </div>
          <div>
            <span>Next review</span>
            <strong>Scheduled</strong>
          </div>
        </div>
        <p>
          Tracking only. The platform does not prescribe, recommend dosage, or
          alter a clinician’s plan.
        </p>
      </Panel>
    </div>
  );
}

function TrainingPerformance() {
  return (
    <div className={styles.trainingGrid}>
      <Panel label="Current training block" className={styles.trainingPlan}>
        <div className={styles.trainingHeading}>
          <div>
            <span className={styles.microLabel}>Block 03 · Strength foundation</span>
            <h3>Lower body + capacity</h3>
          </div>
          <span>Week 4 / 8</span>
        </div>
        <div className={styles.exerciseList}>
          {[
            ["01", "Primary strength", "3 working sets"],
            ["02", "Unilateral control", "Quality emphasis"],
            ["03", "Zone two capacity", "Protected duration"],
            ["04", "Mobility reset", "Evening"],
          ].map(([number, name, detail]) => (
            <div key={number}>
              <span>{number}</span>
              <strong>{name}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
      </Panel>
      <Panel label="Performance context" className={styles.performanceContext}>
        <div className={styles.trainingDial}>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <span>
            <strong>Adapted</strong>
            <small>for today</small>
          </span>
        </div>
        <div className={styles.trainingLoad} aria-hidden="true">
          {[38, 54, 72, 84, 65, 58, 42].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className={styles.trainingAdjustments}>
          <span>
            <i />
            Intensity reduced
          </span>
          <span>
            <i />
            Quality preserved
          </span>
          <span>
            <i />
            Recovery extended
          </span>
        </div>
      </Panel>
    </div>
  );
}

function AtlasIntelligence() {
  return (
    <div className={styles.intelligenceGrid}>
      <Panel label="Incoming context" className={styles.incomingSignals}>
        {[
          ["Sleep", "Shorter than modeled baseline"],
          ["Schedule", "High decision demand"],
          ["Training", "Planned performance block"],
          ["Recovery", "Reduced margin"],
        ].map(([label, detail], index) => (
          <div key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>
              <strong>{label}</strong>
              <small>{detail}</small>
            </p>
            <i />
          </div>
        ))}
      </Panel>
      <div className={styles.atlasCore} aria-label="Atlas intelligence core">
        <i />
        <i />
        <b />
        <b />
        <span>Atlas</span>
        <small>Connecting context</small>
      </div>
      <Panel label="Adapted response" className={styles.adaptedResponse}>
        {[
          ["Hydration", "Moved earlier"],
          ["Training", "Reduced"],
          ["Evening", "Simplified"],
          ["Recovery", "Prioritized"],
        ].map(([label, change]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{change}</strong>
          </div>
        ))}
        <p>The protocol changed because the day did.</p>
      </Panel>
    </div>
  );
}

function MindsetGrowth() {
  return (
    <div className={styles.mindsetGrid}>
      <Panel label="Decision journal" className={styles.decisionJournal}>
        <span className={styles.microLabel}>Private reflection · Today</span>
        <h3>What deserves your best attention?</h3>
        <div className={styles.decisionEntry}>
          <i />
          <p>
            Protect the first ninety minutes for the decision only the founder
            can make.
          </p>
        </div>
        <div className={styles.principleTags}>
          <span>Clarity</span>
          <span>Restraint</span>
          <span>Long horizon</span>
        </div>
      </Panel>
      <Panel label="Growth pattern" className={styles.growthPattern}>
        <div className={styles.growthLine}>
          {[42, 55, 51, 67, 63, 78, 86].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }}>
              <span />
            </i>
          ))}
          <b aria-hidden="true" />
        </div>
        <div className={styles.growthSummary}>
          <span>
            <strong>Decision quality</strong>
            <small>Strengthening</small>
          </span>
          <span>
            <strong>Attention drift</strong>
            <small>Recognized earlier</small>
          </span>
          <span>
            <strong>Weekly review</strong>
            <small>Consistent</small>
          </span>
        </div>
      </Panel>
    </div>
  );
}

function BrotherhoodNetwork() {
  return (
    <div className={styles.brotherhoodGrid}>
      <Panel label="Private brotherhood" className={styles.memberNetwork}>
        <div className={styles.networkCore}>
          <span>001</span>
          <small>Founding member</small>
        </div>
        {[
          ["FS", "Founder circle", "networkNode1"],
          ["PO", "Performance operator", "networkNode2"],
          ["BL", "Business leader", "networkNode3"],
          ["LE", "Legacy entrepreneur", "networkNode4"],
        ].map(([initials, label, className]) => (
          <div className={styles[className]} key={initials}>
            <i aria-hidden="true" />
            <strong>{initials}</strong>
            <small>{label}</small>
          </div>
        ))}
        <i className={styles.networkLine1} />
        <i className={styles.networkLine2} />
        <i className={styles.networkLine3} />
      </Panel>
      <Panel label="Relevant now" className={styles.brotherhoodFeed}>
        <div>
          <span className={styles.microLabel}>Curated introduction</span>
          <h3>One shared challenge. Two complementary operators.</h3>
          <span className={styles.preparedState}>Introduction prepared</span>
        </div>
        <div className={styles.eventRow}>
          <span>18</span>
          <p>
            <strong>Private Founder Table</strong>
            <small>Eight members · invitation only</small>
          </p>
          <b>Reserved</b>
        </div>
        <p className={styles.networkNote}>
          No follower counts. No public feed. Every connection has context.
        </p>
      </Panel>
    </div>
  );
}

function VisionGrowth() {
  return (
    <div className={styles.visionGrid}>
      <Panel label="Vision architecture" className={styles.visionMap}>
        <div className={styles.visionHorizon}>
          <span>Now</span>
          <i />
          <span>1 year</span>
          <i />
          <span>3 years</span>
          <i />
          <span>Legacy</span>
        </div>
        <div className={styles.visionField} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>North star</span>
        </div>
        {[
          ["Business", "Build the enduring company", "Active"],
          ["Family", "Protect time and presence", "Protected"],
          ["Vitality", "Sustain capacity for the horizon", "Aligned"],
          ["Contribution", "Turn experience into impact", "Emerging"],
        ].map(([pillar, objective, state]) => (
          <div className={styles.visionObjective} key={pillar}>
            <span>{pillar}</span>
            <strong>{objective}</strong>
            <small>{state}</small>
          </div>
        ))}
      </Panel>
      <Panel label="Growth cadence" className={styles.cadencePanel}>
        {[
          ["Daily", "One aligned action", "Complete"],
          ["Weekly", "Founder review", "Friday"],
          ["Quarterly", "Recalibrate the horizon", "Upcoming"],
          ["Annual", "Legacy letter", "Protected"],
        ].map(([cadence, action, state]) => (
          <div key={cadence}>
            <span>{cadence}</span>
            <p>
              <strong>{action}</strong>
              <small>{state}</small>
            </p>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function LegacyVault() {
  return (
    <div className={styles.vaultGrid}>
      <Panel label="Legacy Vault" className={styles.vaultPanel}>
        <div className={styles.vaultDoor}>
          <i />
          <i />
          <b />
          <b />
          <span>Private</span>
          <small>Member-controlled archive</small>
        </div>
        <div className={styles.vaultEntries}>
          {[
            ["Voice", "Lessons I want remembered", "Audio"],
            ["Letters", "For the next generation", "Text"],
            ["Principles", "The standard we protect", "Living"],
            ["Milestones", "What the work made possible", "Timeline"],
          ].map(([type, title, format], index) => (
            <div key={type}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>
                <small>{type}</small>
                <strong>{title}</strong>
              </p>
              <b>{format}</b>
            </div>
          ))}
        </div>
      </Panel>
      <Panel label="Continuity" className={styles.continuityPanel}>
        <span className={styles.microLabel}>Future generation access</span>
        <h3>Wisdom, preserved in the member’s own words.</h3>
        <div>
          <span>Encrypted archive</span>
          <span>Release permissions</span>
          <span>Family stewardship</span>
        </div>
      </Panel>
    </div>
  );
}

function IntegratedSystem() {
  const modules = [
    ["Vitality", "integrated1"],
    ["Mindset", "integrated2"],
    ["Brotherhood", "integrated3"],
    ["Legacy", "integrated4"],
    ["Labs", "integrated5"],
    ["Protocol", "integrated6"],
    ["Training", "integrated7"],
    ["Vision", "integrated8"],
  ];

  return (
    <div className={styles.integratedVisual}>
      <div className={styles.integratedCore}>
        <i />
        <i />
        <b />
        <b />
        <strong>Atlas</strong>
        <span>Member 001</span>
        <small>One connected operating system</small>
      </div>
      {modules.map(([label, className], index) => (
        <div className={styles[className]} key={label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{label}</strong>
        </div>
      ))}
      <div className={styles.integratedStatement}>
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
}
