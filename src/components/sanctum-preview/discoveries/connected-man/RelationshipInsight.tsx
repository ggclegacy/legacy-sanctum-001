"use client";

import { AnimatePresence, motion } from "framer-motion";

import { connectedManRelationships } from "@/data/preview/connected-man";
import type { RelationshipDefinition } from "@/lib/preview/preview-types";

export function RelationshipInsight({
  relationship,
  revealedRelationshipIds,
  freeExploration,
  reducedMotion,
  onSelectRelationship,
}: {
  relationship: RelationshipDefinition | null;
  revealedRelationshipIds: string[];
  freeExploration: boolean;
  reducedMotion: boolean;
  onSelectRelationship: (relationshipId: string) => void;
}) {
  return (
    <aside className="connected-relationship-insight" aria-live="polite">
      <AnimatePresence mode="wait">
        {relationship ? (
          <motion.div
            key={relationship.id}
            initial={reducedMotion ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.38 }}
          >
            <span className="connected-insight-label">
              Simulated future capability
            </span>
            <h4>{relationship.title}</h4>
            <div className="connected-insight-path">
              {relationship.path.map((item, index) => (
                <span key={item}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <strong>{item}</strong>
                </span>
              ))}
            </div>
            <p>{relationship.demonstration}</p>
            <blockquote>{relationship.atlasInsight}</blockquote>
            <div className="connected-insight-response">
              <span>What changes</span>
              <strong>{relationship.response}</strong>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            className="connected-insight-empty"
            initial={false}
            animate={{ opacity: 1 }}
          >
            <i aria-hidden="true" />
            <span>The Connected Man</span>
            <h4>Four domains. One evolving intelligence system.</h4>
            <p>
              Atlas will reveal how health, clarity, relationships, and the
              long horizon influence one another.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {freeExploration ? (
        <div className="connected-relationship-index">
          <span>Curated relationships</span>
          {connectedManRelationships.map((item, index) => (
            <button
              className={
                relationship?.id === item.id
                  ? "is-active"
                  : revealedRelationshipIds.includes(item.id)
                    ? "is-revealed"
                    : ""
              }
              type="button"
              key={item.id}
              onClick={() => onSelectRelationship(item.id)}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span>{item.path.join(" → ")}</span>
              <b aria-hidden="true">
                {revealedRelationshipIds.includes(item.id) ? "•" : "↗"}
              </b>
            </button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
