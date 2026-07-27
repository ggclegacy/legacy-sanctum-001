"use client";

import { motion } from "framer-motion";

import {
  adaptiveReasoningSteps,
  getAdaptiveOpportunity,
} from "@/data/preview/adaptive-intelligence";
import type { AdaptiveOpportunityId } from "@/lib/preview/preview-types";

export function AdaptiveReasoning({
  opportunityId,
  activeStepId,
  inspectedStepIds,
  reducedMotion,
  onInspect,
}: {
  opportunityId: AdaptiveOpportunityId | null;
  activeStepId: string | null;
  inspectedStepIds: string[];
  reducedMotion: boolean;
  onInspect: (stepId: string) => void;
}) {
  const opportunity = getAdaptiveOpportunity(opportunityId);
  const activeStep =
    adaptiveReasoningSteps.find((step) => step.id === activeStepId) ??
    adaptiveReasoningSteps[0];

  return (
    <section className="adaptive-reasoning">
      <header className="adaptive-section-heading">
        <div>
          <span>{opportunity?.label ?? "Atlas Opportunity"} · Reasoning View</span>
          <h3>Why Atlas Reached This Conclusion</h3>
        </div>
        <strong>{inspectedStepIds.length} / 05 inspected</strong>
      </header>

      <div className="adaptive-reasoning__workspace">
        <div className="adaptive-reasoning-chain">
          {adaptiveReasoningSteps.map((step, index) => (
            <div key={step.id}>
              <button
                className={[
                  activeStep.id === step.id ? "is-active" : "",
                  inspectedStepIds.includes(step.id) ? "is-inspected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                aria-pressed={activeStep.id === step.id}
                onClick={() => onInspect(step.id)}
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
                <span>{step.label}</span>
                <b aria-hidden="true">↗</b>
              </button>
              {index < adaptiveReasoningSteps.length - 1 ? (
                <span className="adaptive-reasoning-chain__arrow" aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <motion.aside
          className="adaptive-reasoning-explanation"
          key={activeStep.id}
          initial={reducedMotion ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
          aria-live="polite"
        >
          <span>Reasoning step</span>
          <h4>{activeStep.label}</h4>
          <p>{activeStep.explanation}</p>
          <div>
            <small>Contributing information</small>
            {(opportunity?.contributors ?? []).map((contributor) => (
              <i key={contributor}>{contributor}</i>
            ))}
          </div>
        </motion.aside>
      </div>

      <div className="adaptive-disclosure">
        <span>Explainable by design</span>
        <p>
          This reasoning chain demonstrates how a future system could connect
          context. It is not a diagnosis or a recommendation based on real data.
        </p>
      </div>
    </section>
  );
}
