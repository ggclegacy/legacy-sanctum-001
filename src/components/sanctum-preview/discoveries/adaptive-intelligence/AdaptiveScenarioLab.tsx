"use client";

import { AnimatePresence, motion } from "framer-motion";

import {
  adaptiveScenarios,
  getAdaptiveScenario,
  getScenarioModelState,
} from "@/data/preview/adaptive-intelligence";
import type {
  AdaptiveScenarioId,
  DemonstrationStage,
  ProtocolComparisonMode,
} from "@/lib/preview/preview-types";

export function AdaptiveScenarioLab({
  stage,
  scenarioId,
  comparisonMode,
  sleepAdjustmentMinutes,
  reducedMotion,
  onSelectScenario,
  onSetComparison,
  onSetSleepAdjustment,
}: {
  stage: Extract<
    DemonstrationStage,
    "adaptive-scenarios" | "adaptive-protocol" | "adaptive-what-if"
  >;
  scenarioId: AdaptiveScenarioId;
  comparisonMode: ProtocolComparisonMode;
  sleepAdjustmentMinutes: number;
  reducedMotion: boolean;
  onSelectScenario: (scenarioId: AdaptiveScenarioId) => void;
  onSetComparison: (mode: ProtocolComparisonMode) => void;
  onSetSleepAdjustment: (minutes: number) => void;
}) {
  const scenario = getAdaptiveScenario(scenarioId);
  const protocol =
    comparisonMode === "original"
      ? scenario.originalProtocol
      : scenario.adaptedProtocol;
  const modelState = getScenarioModelState(sleepAdjustmentMinutes);

  if (stage === "adaptive-what-if") {
    return (
      <section className="adaptive-what-if">
        <header className="adaptive-section-heading">
          <div>
            <span>Simulated Scenario Model</span>
            <h3>What changes if sleep improves by 45 minutes?</h3>
          </div>
          <strong>Qualitative model</strong>
        </header>

        <div className="adaptive-model">
          <div className="adaptive-model__control">
            <div>
              <span>Current scenario</span>
              <strong>+{sleepAdjustmentMinutes} minutes</strong>
              <span>+45 minutes</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="15"
              value={sleepAdjustmentMinutes}
              aria-label="Simulated sleep improvement in minutes"
              onChange={(event) =>
                onSetSleepAdjustment(Number(event.currentTarget.value))
              }
            />
            <div className="adaptive-model__steps" aria-hidden="true">
              {[0, 15, 30, 45].map((value) => (
                <i
                  className={sleepAdjustmentMinutes >= value ? "is-active" : ""}
                  key={value}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="adaptive-model__system"
            key={sleepAdjustmentMinutes}
            initial={reducedMotion ? false : { opacity: 0.6, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.34 }}
          >
            <ModelState
              label="Recovery capacity"
              value={modelState.recoveryCapacity}
              level={
                modelState.recoveryCapacity === "balanced"
                  ? 3
                  : modelState.recoveryCapacity === "protected"
                    ? 2
                    : 1
              }
            />
            <ModelState
              label="Training margin"
              value={modelState.trainingMargin}
              level={
                modelState.trainingMargin === "expanded"
                  ? 3
                  : modelState.trainingMargin === "protected"
                    ? 2
                    : 1
              }
            />
            <ModelState
              label="Protocol restriction"
              value={modelState.protocolConstraint}
              level={
                modelState.protocolConstraint === "balanced"
                  ? 3
                  : modelState.protocolConstraint === "softened"
                    ? 2
                    : 1
              }
            />
          </motion.div>

          <div className="adaptive-model__chain" aria-live="polite">
            <span>
              <small>Changed condition</small>
              <strong>
                {sleepAdjustmentMinutes === 0
                  ? "Current Sleep"
                  : `Sleep +${sleepAdjustmentMinutes}`}
              </strong>
            </span>
            <i aria-hidden="true">→</i>
            <span>
              <small>Recovery</small>
              <strong>{modelState.recoveryCapacity}</strong>
            </span>
            <i aria-hidden="true">→</i>
            <span>
              <small>Training Margin</small>
              <strong>{modelState.trainingMargin}</strong>
            </span>
            <i aria-hidden="true">→</i>
            <span>
              <small>Daily Response</small>
              <strong>{modelState.protocolConstraint}</strong>
            </span>
          </div>

          <aside className="adaptive-model__explanation" aria-live="polite">
            <span>What the model changes</span>
            <strong>{modelState.explanation}</strong>
            <p>
              This is not a prediction of certainty. It models how one changed
              condition could influence the connected system around it.
            </p>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="adaptive-scenario-lab">
      <header className="adaptive-section-heading">
        <div>
          <span>Simulated Future Capability</span>
          <h3>
            {stage === "adaptive-scenarios"
              ? "Change the Conditions"
              : "Adaptive Daily Protocol"}
          </h3>
        </div>
        <strong>{scenario.label}</strong>
      </header>

      <div
        className="adaptive-scenario-selector"
        role="group"
        aria-label="Simulated day type"
      >
        {adaptiveScenarios.map((item) => (
          <button
            className={scenarioId === item.id ? "is-active" : ""}
            type="button"
            key={item.id}
            aria-pressed={scenarioId === item.id}
            onClick={() => onSelectScenario(item.id)}
          >
            <i>0{item.number}</i>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {stage === "adaptive-scenarios" ? (
        <AnimatePresence mode="wait">
          <motion.div
            className="adaptive-scenario-summary"
            key={scenario.id}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.38 }}
          >
            <div className="adaptive-scenario-signals">
              <span>Signal inputs</span>
              {scenario.signals.map((signal, index) => (
                <p key={signal}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  {signal}
                </p>
              ))}
            </div>
            <div className="adaptive-scenario-priority">
              <span>Atlas priority</span>
              <h4>{scenario.priority}</h4>
              <p>{scenario.explanation}</p>
            </div>
            <div className="adaptive-scenario-responses">
              <ResponseDatum label="Training" value={scenario.training} />
              <ResponseDatum label="Hydration" value={scenario.hydration} />
              <ResponseDatum label="Recovery" value={scenario.recovery} />
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="adaptive-protocol">
          <div
            className="adaptive-protocol__comparison"
            role="group"
            aria-label="Compare original and Atlas-adapted plans"
          >
            <button
              className={comparisonMode === "original" ? "is-active" : ""}
              type="button"
              aria-pressed={comparisonMode === "original"}
              onClick={() => onSetComparison("original")}
            >
              Original Day
            </button>
            <button
              className={comparisonMode === "adapted" ? "is-active" : ""}
              type="button"
              aria-pressed={comparisonMode === "adapted"}
              onClick={() => onSetComparison("adapted")}
            >
              Atlas-Adapted Day
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="adaptive-protocol__timeline"
              key={`${scenario.id}-${comparisonMode}`}
              initial={reducedMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, x: -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.36 }}
              aria-live="polite"
            >
              {protocol.map((item, index) => (
                <div
                  className={`is-${item.emphasis}`}
                  key={item.id}
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <span>{item.period}</span>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                  <b>{item.change}</b>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="adaptive-protocol__signature">
            <span>Why it changed</span>
            <strong>
              The protocol did not change because the goal changed. It changed
              because the day did.
            </strong>
          </div>
        </div>
      )}

      <div className="adaptive-disclosure">
        <span>Preview scenario</span>
        <p>
          These day types model possible future adaptations. They are not
          prescriptions and do not use actual member health or schedule data.
        </p>
      </div>
    </section>
  );
}

function ResponseDatum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModelState({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level: number;
}) {
  return (
    <div className="adaptive-model-state">
      <span>{label}</span>
      <strong>{value}</strong>
      <div aria-hidden="true">
        {[1, 2, 3].map((item) => (
          <i className={item <= level ? "is-active" : ""} key={item} />
        ))}
      </div>
    </div>
  );
}
