"use client";

import { motion } from "framer-motion";

import { adaptiveAnalysisStages } from "@/data/preview/adaptive-intelligence";

export function AdaptiveAnalysis({
  activeIndex,
  reducedMotion,
}: {
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const activeStage =
    adaptiveAnalysisStages[activeIndex] ?? adaptiveAnalysisStages[0];

  return (
    <section className="adaptive-analysis">
      <header className="adaptive-section-heading">
        <div>
          <span>High-Demand Day · Simulated Future Capability</span>
          <h3>{activeStage.label}</h3>
        </div>
        <strong>
          {String(activeIndex + 1).padStart(2, "0")} / 04
        </strong>
      </header>

      <div className="adaptive-analysis__workspace">
        <nav className="adaptive-analysis__stages" aria-label="Analysis stages">
          {adaptiveAnalysisStages.map((stage, index) => (
            <div
              className={[
                index === activeIndex ? "is-active" : "",
                index < activeIndex ? "is-complete" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={stage.id}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span>{stage.label}</span>
              <b aria-hidden="true" />
            </div>
          ))}
        </nav>

        <div className="adaptive-analysis__field">
          <div className="adaptive-analysis__core">
            <i aria-hidden="true" />
            <span>Atlas analysis</span>
            <strong>{activeStage.label}</strong>
          </div>
          <div className="adaptive-analysis__inputs">
            {activeStage.inputs.map((input, index) => (
              <motion.div
                key={`${activeStage.id}-${input}`}
                initial={
                  reducedMotion ? false : { opacity: 0, x: index % 2 ? 12 : -12 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: reducedMotion ? 0 : index * 0.08,
                  duration: reducedMotion ? 0 : 0.38,
                }}
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
                <span>{input}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.aside
          className="adaptive-analysis__output"
          key={activeStage.id}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.42 }}
          aria-live="polite"
        >
          <span>What Atlas understands</span>
          <strong>{activeStage.output}</strong>
          <p>{activeStage.caption}</p>
        </motion.aside>
      </div>
    </section>
  );
}
