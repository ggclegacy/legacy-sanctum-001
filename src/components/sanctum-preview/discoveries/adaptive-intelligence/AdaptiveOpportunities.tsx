"use client";

import { AnimatePresence, motion } from "framer-motion";

import {
  adaptiveOpportunities,
  getAdaptiveOpportunity,
} from "@/data/preview/adaptive-intelligence";
import type { AdaptiveOpportunityId } from "@/lib/preview/preview-types";

export function AdaptiveOpportunities({
  selectedOpportunityId,
  reducedMotion,
  onSelect,
}: {
  selectedOpportunityId: AdaptiveOpportunityId | null;
  reducedMotion: boolean;
  onSelect: (opportunityId: AdaptiveOpportunityId) => void;
}) {
  const selected = getAdaptiveOpportunity(selectedOpportunityId);

  return (
    <section className="adaptive-opportunities">
      <header className="adaptive-section-heading">
        <div>
          <span>High-Demand Day · Prioritized Attention</span>
          <h3>Three Atlas Opportunities</h3>
        </div>
        <strong>Choose one</strong>
      </header>

      <div className="adaptive-opportunity-orbit">
        <div className="adaptive-opportunity-orbit__core">
          <i aria-hidden="true" />
          <span>Atlas</span>
          <strong>Priority Field</strong>
        </div>
        {adaptiveOpportunities.map((opportunity, index) => (
          <motion.button
            className={[
              "adaptive-opportunity-object",
              `adaptive-opportunity-object--${index + 1}`,
              selectedOpportunityId === opportunity.id ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            key={opportunity.id}
            aria-pressed={selectedOpportunityId === opportunity.id}
            onClick={() => onSelect(opportunity.id)}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.1,
              duration: reducedMotion ? 0 : 0.42,
            }}
          >
            <i>0{opportunity.number}</i>
            <span>{opportunity.label}</span>
            <small>Inspect opportunity</small>
          </motion.button>
        ))}
        <svg
          className="adaptive-opportunity-orbit__lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="50" y1="50" x2="50" y2="8" />
          <line x1="50" y1="50" x2="88" y2="78" />
          <line x1="50" y1="50" x2="12" y2="78" />
        </svg>
      </div>

      <aside className="adaptive-opportunity-detail" aria-live="polite">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.36 }}
            >
              <span>Simulated future capability</span>
              <h4>{selected.label}</h4>
              <div className="adaptive-opportunity-detail__columns">
                <div>
                  <small>Observed</small>
                  {selected.observed.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
                <div>
                  <small>Why it matters</small>
                  <p>{selected.significance}</p>
                </div>
                <div>
                  <small>Atlas could prioritize</small>
                  {selected.response.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="adaptive-opportunity-detail__empty">
              <span>Transparent intelligence</span>
              <h4>Select an opportunity to inspect the reasoning behind it.</h4>
            </div>
          )}
        </AnimatePresence>
      </aside>
    </section>
  );
}
