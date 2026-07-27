"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type MemberAppPreviewProps = {
  firstName: string;
  memberNumber: string;
};

const modules = [
  { key: "command", code: "00", label: "Command" },
  { key: "vitality", code: "01", label: "Vitality" },
  { key: "atlas", code: "02", label: "Atlas" },
  { key: "mindset", code: "03", label: "Mindset" },
  { key: "brotherhood", code: "04", label: "Circle" },
  { key: "legacy", code: "05", label: "Legacy" },
] as const;

const guidance = [
  "Initialize your private command core",
  "Explore your longitudinal bloodwork",
  "Run a cross-pillar synthesis",
  "Model the decision against your standard",
  "Open the connection Atlas identified",
  "Reveal the enduring horizon",
];

type Biomarker = {
  key: string;
  label: string;
  value: string;
  unit: string;
  delta: string;
  status: string;
  range: string;
  insight: string;
  points: number[];
};

const biomarkers: Biomarker[] = [
  {
    key: "testosterone",
    label: "Total Testosterone",
    value: "684",
    unit: "ng/dL",
    delta: "+8.2%",
    status: "Within range",
    range: "Reference 264–916",
    insight:
      "Upward movement follows eight weeks of improved sleep consistency and the current resistance protocol.",
    points: [42, 47, 44, 53, 58, 62, 67, 72],
  },
  {
    key: "apob",
    label: "Apolipoprotein B",
    value: "82",
    unit: "mg/dL",
    delta: "−11.8%",
    status: "Trending down",
    range: "Reference < 90",
    insight:
      "The twelve-month view shows sustained improvement. Atlas would preserve the current protocol and flag the next lab for comparison.",
    points: [78, 74, 70, 65, 60, 53, 48, 43],
  },
  {
    key: "a1c",
    label: "Hemoglobin A1c",
    value: "5.2",
    unit: "%",
    delta: "−0.2",
    status: "Stable",
    range: "Reference 4.8–5.6",
    insight:
      "Glucose control remains stable while training volume has increased. No drift is visible across the last four draws.",
    points: [62, 60, 63, 57, 55, 56, 52, 51],
  },
  {
    key: "crp",
    label: "hs-CRP",
    value: "0.6",
    unit: "mg/L",
    delta: "−35%",
    status: "Low signal",
    range: "Reference < 1.0",
    insight:
      "Inflammatory signal declined after recovery days were protected. Atlas connects the change to training load and sleep history.",
    points: [76, 68, 71, 59, 52, 45, 39, 33],
  },
  {
    key: "vitamin-d",
    label: "Vitamin D",
    value: "48",
    unit: "ng/mL",
    delta: "+12%",
    status: "Within range",
    range: "Reference 30–100",
    insight:
      "The current protocol produced a steady rise without volatility. The next draw is already placed on the member timeline.",
    points: [32, 35, 38, 40, 44, 47, 51, 56],
  },
];

export function MemberAppPreview({
  firstName,
  memberNumber,
}: MemberAppPreviewProps) {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  function advance() {
    if (step === modules.length - 1) {
      setComplete(true);
      return;
    }
    setStep((current) => current + 1);
  }

  function replay() {
    setStep(0);
    setComplete(false);
  }

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--nexus-x", `${x}%`);
    event.currentTarget.style.setProperty("--nexus-y", `${y}%`);
  }

  return (
    <div
      className="member-preview nexus-preview"
      aria-label="Interactive preview of the future Legacy Sanctum member platform"
    >
      <div className="nexus-shell" onPointerMove={trackPointer}>
        <div className="nexus-atmosphere" aria-hidden="true" />
        <header className="nexus-header">
          <div className="nexus-brand">
            <span className="nexus-brand__sigil">LS</span>
            <div>
              <strong>Legacy Sanctum</strong>
              <small>Human Performance Intelligence</small>
            </div>
          </div>
          <div className="nexus-session">
            <i />
            <span>Private system online</span>
            <b>00{memberNumber}</b>
          </div>
          <div className="nexus-identity">
            <span>{firstName}</span>
            <small>Founding access</small>
          </div>
        </header>

        <nav className="nexus-module-track" aria-label="Preview progress">
          {modules.map((module, index) => (
            <div
              key={module.key}
              className={
                index === step && !complete
                  ? "is-active"
                  : index < step || complete
                    ? "is-passed"
                    : ""
              }
            >
              <span>{module.code}</span>
              <strong>{module.label}</strong>
              <i />
            </div>
          ))}
        </nav>

        <div className="nexus-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={complete ? "complete" : modules[step].key}
              className="nexus-screen"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, filter: "blur(8px)", scale: 0.99 }
              }
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, filter: "blur(5px)", scale: 1.006 }
              }
              transition={transition}
            >
              {complete ? (
                <SystemComplete
                  firstName={firstName}
                  memberNumber={memberNumber}
                  onReplay={replay}
                />
              ) : (
                <ActiveScreen
                  step={step}
                  firstName={firstName}
                  memberNumber={memberNumber}
                  onAdvance={advance}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="nexus-guidance">
          <div className="nexus-guidance__atlas">
            <span>A</span>
            <i />
            <div>
              <small>
                {complete ? "System preview complete" : "Atlas directive"}
              </small>
              <strong>
                {complete
                  ? "Your founding access is reserved."
                  : guidance[step]}
              </strong>
            </div>
          </div>
          <div className="nexus-guidance__progress">
            <span>{complete ? "06" : String(step).padStart(2, "0")}</span>
            <i />
            <span>06</span>
          </div>
        </footer>
      </div>

      <div className="nexus-disclaimer">
        <span>Interactive concept · Sample member data</span>
        <p>
          Demonstrates future platform capabilities. Example wellness data is
          educational and not medical guidance.
        </p>
      </div>
    </div>
  );
}

function ActiveScreen({
  step,
  firstName,
  memberNumber,
  onAdvance,
}: {
  step: number;
  firstName: string;
  memberNumber: string;
  onAdvance: () => void;
}) {
  switch (step) {
    case 0:
      return (
        <CommandCore
          firstName={firstName}
          memberNumber={memberNumber}
          onAdvance={onAdvance}
        />
      );
    case 1:
      return <VitalityIntelligence onAdvance={onAdvance} />;
    case 2:
      return <AtlasSynthesis onAdvance={onAdvance} />;
    case 3:
      return <DecisionIntelligence onAdvance={onAdvance} />;
    case 4:
      return <BrotherhoodNetwork onAdvance={onAdvance} />;
    default:
      return <LegacyArchitecture onAdvance={onAdvance} />;
  }
}

function ScreenTitle({
  system,
  title,
  detail,
  meta,
}: {
  system: string;
  title: string;
  detail: string;
  meta: string;
}) {
  return (
    <div className="nexus-title">
      <div>
        <p>{system}</p>
        <h3>{title}</h3>
        <span>{detail}</span>
      </div>
      <small>{meta}</small>
    </div>
  );
}

function CommandCore({
  firstName,
  memberNumber,
  onAdvance,
}: {
  firstName: string;
  memberNumber: string;
  onAdvance: () => void;
}) {
  return (
    <div className="command-core-screen">
      <ScreenTitle
        system="00 · Command Intelligence"
        title={`Good morning, ${firstName}.`}
        detail="One living view of the man, the mission, and the long horizon."
        meta={`Member ${memberNumber} · 07:42`}
      />

      <div className="command-spatial-grid">
        <section className="command-vector">
          <span className="nexus-label">Daily vector</span>
          <strong>Protect the decision window.</strong>
          <p>
            The highest-leverage work aligns with your energy curve, current
            objective, and 90-day legacy milestone.
          </p>
          <div className="vector-time">
            <span>08:00</span>
            <i />
            <b>11:00</b>
          </div>
          <div className="vector-lock">
            <i />
            Focus window protected
          </div>
        </section>

        <section className="command-orbit" aria-label="Connected member systems">
          <div className="command-orbit__ring command-orbit__ring--outer" />
          <div className="command-orbit__ring command-orbit__ring--inner" />
          <span className="orbit-node orbit-node--labs">
            Labs <b>24</b>
          </span>
          <span className="orbit-node orbit-node--protocol">
            Protocol <b>75%</b>
          </span>
          <span className="orbit-node orbit-node--circle">
            Circle <b>01</b>
          </span>
          <span className="orbit-node orbit-node--legacy">
            Legacy <b>03</b>
          </span>
          <button
            className="command-core-button nexus-target"
            type="button"
            onClick={onAdvance}
          >
            <span>A</span>
            <strong>Initialize</strong>
            <small>Private command core</small>
          </button>
        </section>

        <section className="command-signals">
          <span className="nexus-label">Live intelligence</span>
          {[
            ["Biology", "Blood panel synchronized", "24 markers"],
            ["Capacity", "Recovery window stable", "82 / 100"],
            ["Direction", "One decision unresolved", "Priority"],
            ["Network", "High-value match found", "91% fit"],
          ].map(([system, signal, value]) => (
            <div key={system}>
              <i />
              <span>{system}</span>
              <strong>{signal}</strong>
              <b>{value}</b>
            </div>
          ))}
        </section>
      </div>

      <div className="command-system-line">
        {["Labs", "Wearables", "Protocol", "Objectives", "Circle", "Legacy"].map(
          (source) => (
            <span key={source}>
              <i />
              {source}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function VitalityIntelligence({ onAdvance }: { onAdvance: () => void }) {
  const [selectedKey, setSelectedKey] = useState(biomarkers[0].key);
  const selected =
    biomarkers.find((marker) => marker.key === selectedKey) ?? biomarkers[0];

  return (
    <div className="vitality-intelligence-screen">
      <ScreenTitle
        system="01 · Vitality Intelligence"
        title="Your biology, across time."
        detail="Bloodwork, recovery, protocols, and patterns in one longitudinal system."
        meta="Last sync · 18 Jul 2026"
      />

      <div className="biomarker-command">
        <aside className="biomarker-index">
          <div className="biomarker-index__header">
            <span>Blood panel</span>
            <b>24 markers</b>
          </div>
          {biomarkers.map((marker) => (
            <button
              key={marker.key}
              className={marker.key === selected.key ? "is-selected" : ""}
              type="button"
              onClick={() => setSelectedKey(marker.key)}
            >
              <span>{marker.label}</span>
              <strong>{marker.value}</strong>
              <small>{marker.unit}</small>
              <i />
            </button>
          ))}
        </aside>

        <section className="biomarker-analysis">
          <header>
            <div>
              <span className="nexus-label">Longitudinal analysis</span>
              <h4>{selected.label}</h4>
            </div>
            <div className="biomarker-current">
              <strong>{selected.value}</strong>
              <span>{selected.unit}</span>
              <b>{selected.delta}</b>
            </div>
          </header>

          <TrendPlot points={selected.points} />

          <div className="biomarker-axis">
            <span>Aug ’25</span>
            <span>Nov</span>
            <span>Feb ’26</span>
            <span>May</span>
            <span>Jul ’26</span>
          </div>

          <div className="biomarker-meta">
            <span>
              <i />
              {selected.status}
            </span>
            <span>{selected.range}</span>
            <span>5 lab draws compared</span>
          </div>
        </section>

        <aside className="biomarker-insight">
          <div className="insight-orb">
            <span>A</span>
            <i />
          </div>
          <span className="nexus-label">Atlas pattern</span>
          <h4>Context, not isolated numbers.</h4>
          <p>{selected.insight}</p>
          <div className="correlation-stack">
            <span>
              <i style={{ width: "82%" }} />
              Sleep consistency <b>82%</b>
            </span>
            <span>
              <i style={{ width: "74%" }} />
              Protocol adherence <b>74%</b>
            </span>
            <span>
              <i style={{ width: "91%" }} />
              Training alignment <b>91%</b>
            </span>
          </div>
          <button
            className="nexus-cta nexus-target"
            type="button"
            onClick={onAdvance}
          >
            <span>Synthesize this pattern</span>
            <b>Atlas ↗</b>
          </button>
        </aside>
      </div>

      <div className="data-source-rail">
        <span>Connected sources</span>
        {[
          ["LB", "Lab history", "Synced"],
          ["WR", "Wearable recovery", "Live"],
          ["PR", "Protocol adherence", "Live"],
          ["NT", "Nutrition log", "Weekly"],
        ].map(([code, name, state]) => (
          <div key={code}>
            <i>{code}</i>
            <span>{name}</span>
            <b>{state}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendPlot({ points }: { points: number[] }) {
  return (
    <div className="trend-plot" aria-label="Twelve-month biomarker trend">
      <div className="trend-reference-band">
        <span>Personal reference band</span>
      </div>
      <div className="trend-grid" aria-hidden="true" />
      {points.map((point, index) => {
        const next = points[index + 1];
        const x = (index / (points.length - 1)) * 100;
        const y = 88 - point * 0.72;
        let segment = null;

        if (next !== undefined) {
          const nextX = ((index + 1) / (points.length - 1)) * 100;
          const nextY = 88 - next * 0.72;
          const dx = nextX - x;
          const dy = nextY - y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          segment = (
            <i
              className="trend-segment"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${length}%`,
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        }

        return (
          <span key={`${point}-${index}`}>
            {segment}
            <i
              className="trend-point"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          </span>
        );
      })}
      <div className="trend-scanline" aria-hidden="true" />
    </div>
  );
}

function AtlasSynthesis({ onAdvance }: { onAdvance: () => void }) {
  const [query, setQuery] = useState("attention");
  const [synthesized, setSynthesized] = useState(false);

  const outputs: Record<string, { title: string; body: string; action: string }> =
    {
      attention: {
        title: "Your biology is ready. Your calendar is not.",
        body: "Recovery and lab trends support a demanding work block, but fragmentation across the next three days threatens the decision window.",
        action: "Protect Tuesday 08:00–11:00 and move two nonessential meetings.",
      },
      drift: {
        title: "The long-term project is losing proximity.",
        body: "Short-range execution is strong, but the 90-day legacy milestone has gone twelve days without a protected action.",
        action: "Create one irreversible move before Friday.",
      },
      compound: {
        title: "One introduction could accelerate two objectives.",
        body: "The member network contains a high-confidence match across leadership development and organizational health.",
        action: "Review the private introduction Atlas identified.",
      },
    };
  const output = outputs[query];

  return (
    <div className="atlas-synthesis-screen">
      <ScreenTitle
        system="02 · Atlas Intelligence"
        title="Intelligence across the whole man."
        detail="Atlas synthesizes biology, behavior, objectives, relationships, and the long horizon."
        meta="Six systems connected"
      />

      <div className="atlas-engine">
        <aside className="atlas-source-matrix">
          <span className="nexus-label">Active signal map</span>
          {[
            ["Bloodwork", "24", 88],
            ["Recovery", "82", 72],
            ["Calendar", "17", 94],
            ["Objectives", "04", 64],
            ["Brotherhood", "91", 81],
            ["Legacy", "03", 76],
          ].map(([name, value, strength]) => (
            <div key={name}>
              <span>{name}</span>
              <i>
                <b style={{ width: `${strength}%` }} />
              </i>
              <strong>{value}</strong>
            </div>
          ))}
        </aside>

        <section className="atlas-core-engine">
          <div
            className={synthesized ? "atlas-reactor is-active" : "atlas-reactor"}
          >
            <i />
            <i />
            <button
              className="nexus-target"
              type="button"
              onClick={() => setSynthesized(true)}
            >
              <span>A</span>
              <strong>
                {synthesized ? "Synthesis complete" : "Run synthesis"}
              </strong>
              <small>Cross-pillar intelligence</small>
            </button>
          </div>
          <div className="atlas-query-rail">
            {[
              ["attention", "What needs attention?"],
              ["drift", "Where am I drifting?"],
              ["compound", "What could compound?"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={query === value ? "is-selected" : ""}
                type="button"
                onClick={() => {
                  setQuery(value);
                  setSynthesized(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <aside
          className={synthesized ? "atlas-output is-visible" : "atlas-output"}
        >
          <span className="nexus-label">Atlas briefing</span>
          {synthesized ? (
            <>
              <div className="atlas-output__confidence">
                <i />
                High-confidence pattern
              </div>
              <h4>{output.title}</h4>
              <p>{output.body}</p>
              <div className="atlas-output__action">
                <span>Recommended action</span>
                <strong>{output.action}</strong>
              </div>
              <button
                className="nexus-cta nexus-target"
                type="button"
                onClick={onAdvance}
              >
                <span>Model the decision</span>
                <b>Mindset ↗</b>
              </button>
            </>
          ) : (
            <div className="atlas-output__waiting">
              <i />
              <span>Awaiting synthesis</span>
              <p>Select a question and activate the Atlas core.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function DecisionIntelligence({ onAdvance }: { onAdvance: () => void }) {
  const [selected, setSelected] = useState("alignment");
  const options = {
    momentum: {
      alignment: 58,
      capacity: 84,
      reversibility: 72,
      horizon: 46,
      verdict: "Fast, but misaligned with the enduring objective.",
    },
    alignment: {
      alignment: 94,
      capacity: 76,
      reversibility: 63,
      horizon: 91,
      verdict: "Best fit across present capacity and long-term direction.",
    },
    resistance: {
      alignment: 44,
      capacity: 92,
      reversibility: 88,
      horizon: 38,
      verdict: "Easy to execute, unlikely to change the trajectory.",
    },
  };
  const model = options[selected as keyof typeof options];

  return (
    <div className="decision-intelligence-screen">
      <ScreenTitle
        system="03 · Mindset Intelligence"
        title="The Decision Room."
        detail="Model the move against capacity, consequence, standards, and the long horizon."
        meta="Private decision · Draft 01"
      />

      <div className="decision-model">
        <section className="decision-brief">
          <span className="nexus-label">Decision under review</span>
          <h4>Which path should govern the next 90 days?</h4>
          <p>
            This sample demonstrates how Atlas transforms pressure into a
            structured decision—without making the decision for you.
          </p>
          <div className="decision-standard">
            <span>Governing standard</span>
            <strong>Build what becomes more valuable with time.</strong>
          </div>
        </section>

        <section className="decision-paths">
          {[
            ["momentum", "Immediate momentum", "Move now and learn in motion"],
            [
              "alignment",
              "Long-term alignment",
              "Protect the enduring objective",
            ],
            [
              "resistance",
              "Lowest resistance",
              "Preserve capacity and optionality",
            ],
          ].map(([value, title, detail]) => (
            <button
              key={value}
              className={selected === value ? "is-selected nexus-target" : ""}
              type="button"
              onClick={() => setSelected(value)}
            >
              <span>{title}</span>
              <small>{detail}</small>
              <i />
            </button>
          ))}
        </section>

        <section className="decision-vector">
          <span className="nexus-label">Live consequence model</span>
          {[
            ["Standard alignment", model.alignment],
            ["Current capacity", model.capacity],
            ["Reversibility", model.reversibility],
            ["Long-horizon value", model.horizon],
          ].map(([label, score]) => (
            <div key={label}>
              <span>{label}</span>
              <i>
                <b style={{ width: `${score}%` }} />
              </i>
              <strong>{score}</strong>
            </div>
          ))}
          <p>{model.verdict}</p>
          <button
            className="nexus-cta nexus-target"
            type="button"
            onClick={onAdvance}
          >
            <span>Lock the standard</span>
            <b>Continue ↗</b>
          </button>
        </section>
      </div>
    </div>
  );
}

function BrotherhoodNetwork({ onAdvance }: { onAdvance: () => void }) {
  const [selected, setSelected] = useState(false);

  return (
    <div className="brotherhood-network-screen">
      <ScreenTitle
        system="04 · Brotherhood Intelligence"
        title="Precision over popularity."
        detail="No feed. No noise. Curated access to the right man at the right moment."
        meta="Private circle · 18 members"
      />

      <div className="network-intelligence">
        <section className="network-field" aria-label="Curated member network">
          <div className="network-grid" aria-hidden="true" />
          <span className="network-self">
            <b>BV</b>
            <small>You</small>
          </span>
          <span className="network-node network-node--one">
            <b>DC</b>
            <small>Capital</small>
          </span>
          <span className="network-node network-node--two">
            <b>JL</b>
            <small>Health</small>
          </span>
          <button
            className={
              selected
                ? "network-node network-node--match is-selected"
                : "network-node network-node--match nexus-target"
            }
            type="button"
            onClick={() => setSelected(true)}
          >
            <b>MR</b>
            <small>91% match</small>
          </button>
          <span className="network-node network-node--four">
            <b>AK</b>
            <small>Legacy</small>
          </span>
          <i className="network-link network-link--one" />
          <i className="network-link network-link--two" />
          <i className="network-link network-link--match" />
          <i className="network-link network-link--four" />
          <div className="network-radar" aria-hidden="true">
            <i />
          </div>
        </section>

        <aside
          className={selected ? "network-match is-visible" : "network-match"}
        >
          {selected ? (
            <>
              <div className="network-match__identity">
                <span>MR</span>
                <div>
                  <small>Curated match</small>
                  <h4>Marcus Reid</h4>
                  <p>Leadership systems · Organizational health</p>
                </div>
              </div>
              <div className="match-confidence">
                <strong>91</strong>
                <div>
                  <span>Connection confidence</span>
                  <i>
                    <b />
                  </i>
                </div>
              </div>
              <div className="match-reasons">
                {[
                  ["Shared ground", "Leadership development"],
                  ["Complementary reach", "Culture + operating systems"],
                  ["Timing", "Both entering a scale transition"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <button
                className="nexus-cta nexus-target"
                type="button"
                onClick={onAdvance}
              >
                <span>Preview private introduction</span>
                <b>Legacy ↗</b>
              </button>
            </>
          ) : (
            <div className="network-awaiting">
              <i />
              <span>Atlas identified one high-value connection.</span>
              <p>Open the illuminated member node to understand why.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function LegacyArchitecture({ onAdvance }: { onAdvance: () => void }) {
  const [horizon, setHorizon] = useState(0);
  const horizons = [
    {
      key: "now",
      label: "Now",
      span: "0–12 months",
      title: "Build with intention.",
      detail:
        "Active ventures, decisive moves, personal capacity, and the people requiring your leadership now.",
      nodes: ["Launch decision", "Leadership bench", "Family standard"],
    },
    {
      key: "next",
      label: "Next",
      span: "1–5 years",
      title: "Create durability.",
      detail:
        "Systems, ownership, mentorship, succession, and institutions capable of growing without constant force.",
      nodes: ["Ownership system", "Successor development", "Knowledge vault"],
    },
    {
      key: "enduring",
      label: "Enduring",
      span: "10+ years",
      title: "Design what remains.",
      detail:
        "Principles, people, institutions, and impact deliberately built to survive beyond your direct involvement.",
      nodes: ["Family doctrine", "Enduring institution", "Generational impact"],
    },
  ];
  const active = horizons[horizon];

  function revealNext() {
    if (horizon < horizons.length - 1) {
      setHorizon((current) => current + 1);
      return;
    }
    onAdvance();
  }

  return (
    <div className="legacy-architecture-screen">
      <ScreenTitle
        system="05 · Legacy Intelligence"
        title="Architect the long horizon."
        detail="Connect today’s choices to the people, principles, and institutions meant to endure."
        meta="Legacy map · Living system"
      />

      <div className="legacy-system">
        <nav className="legacy-horizon-nav" aria-label="Legacy horizons">
          {horizons.map((item, index) => (
            <button
              key={item.key}
              className={horizon === index ? "is-selected" : ""}
              type="button"
              onClick={() => setHorizon(index)}
            >
              <span>0{index + 1}</span>
              <strong>{item.label}</strong>
              <small>{item.span}</small>
              <i />
            </button>
          ))}
        </nav>

        <section className="legacy-map">
          <div className="legacy-map__axis" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              className="legacy-map__content"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.34 }}
            >
              <span className="nexus-label">{active.span}</span>
              <h4>{active.title}</h4>
              <p>{active.detail}</p>
              <div className="legacy-nodes">
                {active.nodes.map((node, index) => (
                  <span key={node}>
                    <i>{index + 1}</i>
                    <strong>{node}</strong>
                    <small>{index === 0 ? "Active" : "Mapped"}</small>
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <aside className="legacy-vault">
          <span className="nexus-label">Legacy vault</span>
          <div className="vault-core">
            <i />
            <span>LS</span>
            <i />
          </div>
          <strong>
            {horizon === 2
              ? "Enduring architecture revealed"
              : "Horizon encrypted"}
          </strong>
          <p>
            {horizon === 2
              ? "The platform preserves the principles, decisions, and structures behind what you are building."
              : "Advance through the horizons to reveal what the present is designed to become."}
          </p>
          <button
            className="nexus-cta nexus-target"
            type="button"
            onClick={revealNext}
          >
            <span>
              {horizon === 2
                ? "Complete system preview"
                : "Reveal next horizon"}
            </span>
            <b>{horizon === 2 ? "Finish ↗" : `0${horizon + 2} ↗`}</b>
          </button>
        </aside>
      </div>
    </div>
  );
}

function SystemComplete({
  firstName,
  memberNumber,
  onReplay,
}: {
  firstName: string;
  memberNumber: string;
  onReplay: () => void;
}) {
  return (
    <div className="system-complete-screen">
      <div className="system-complete__orbit">
        <i />
        <i />
        <i />
        <span>{memberNumber}</span>
      </div>
      <p>Guided system preview complete</p>
      <h3>The full picture changes what becomes possible, {firstName}.</h3>
      <span>
        Vitality strengthens the man. Mindset directs him. Brotherhood expands
        his reach. Legacy determines what endures. Atlas connects it all.
      </span>
      <div className="system-complete__modules">
        {["Bloodwork", "Protocol", "Atlas", "Decisions", "Circle", "Legacy"].map(
          (module) => (
            <i key={module}>
              <span />
              {module}
            </i>
          ),
        )}
      </div>
      <div className="system-complete__member">
        <span>{memberNumber}</span>
        <div>
          <small>Founding member access</small>
          <strong>Reserved</strong>
        </div>
      </div>
      <button type="button" onClick={onReplay}>
        Replay interactive preview
      </button>
    </div>
  );
}
