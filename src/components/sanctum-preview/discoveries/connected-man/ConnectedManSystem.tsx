"use client";

import { motion } from "framer-motion";

import {
  connectedManPillars,
  getCapability,
  getPillar,
  getRelationship,
} from "@/data/preview/connected-man";
import type {
  AtlasDemonstrationMember,
  DemonstrationStage,
  PillarId,
} from "@/lib/preview/preview-types";

import { CapabilityNode } from "./CapabilityNode";
import { MemberCore } from "./MemberCore";
import { PillarNode } from "./PillarNode";
import { RelationshipInsight } from "./RelationshipInsight";

const capabilityPositions: Record<
  PillarId,
  Array<{ x: number; y: number }>
> = {
  vitality: [
    { x: 34, y: 34 },
    { x: 50, y: 25 },
    { x: 66, y: 34 },
    { x: 50, y: 39 },
  ],
  mindset: [
    { x: 66, y: 35 },
    { x: 75, y: 50 },
    { x: 66, y: 65 },
    { x: 61, y: 50 },
  ],
  brotherhood: [
    { x: 34, y: 66 },
    { x: 50, y: 75 },
    { x: 66, y: 66 },
    { x: 50, y: 61 },
  ],
  legacy: [
    { x: 34, y: 35 },
    { x: 25, y: 50 },
    { x: 34, y: 65 },
    { x: 39, y: 50 },
  ],
};

export function ConnectedManSystem({
  member,
  stage,
  activePillarId,
  activeCapabilityId,
  activeRelationshipId,
  revealedRelationshipIds,
  meaningfulInteractionCount,
  reducedMotion,
  onSelectPillar,
  onSelectCapability,
  onSelectRelationship,
  onResetView,
}: {
  member: AtlasDemonstrationMember;
  stage: DemonstrationStage;
  activePillarId: PillarId | null;
  activeCapabilityId: string | null;
  activeRelationshipId: string | null;
  revealedRelationshipIds: string[];
  meaningfulInteractionCount: number;
  reducedMotion: boolean;
  onSelectPillar: (pillarId: PillarId) => void;
  onSelectCapability: (capabilityId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
  onResetView: () => void;
}) {
  const activePillar = getPillar(activePillarId);
  const activeRelationship = getRelationship(activeRelationshipId);
  const relatedPillars = new Set(activeRelationship?.relatedPillarIds ?? []);
  const relationshipCapabilities = (
    activeRelationship?.capabilityIds ?? []
  ).flatMap((capabilityId) => {
    const match = getCapability(capabilityId);
    return match ? [match.capability] : [];
  });
  const positions = activePillar
    ? capabilityPositions[activePillar.id]
    : capabilityPositions.vitality;
  const atlasTarget =
    stage === "guided-vitality"
      ? "vitality"
      : stage === "guided-legacy"
        ? "legacy"
        : null;
  const freeExploration = stage === "free-exploration";

  return (
    <section className="connected-man-demonstration">
      <header className="connected-man-heading">
        <div>
          <span>The Atlas Demonstration · 01</span>
          <h3>The Connected Man</h3>
          <p>
            Most platforms store isolated information. Legacy Sanctum is being
            built to understand how the parts connect.
          </p>
        </div>
        <div className="connected-man-heading__status">
          <span>Simulated future capability</span>
          <strong>{meaningfulInteractionCount} meaningful interactions</strong>
          <small>{revealedRelationshipIds.length} of 6 relationships revealed</small>
        </div>
      </header>

      <div className="connected-man-workspace">
        <div className="connected-man-visual">
          <div className="connected-man-field">
            <div className="connected-man-field__grid" aria-hidden="true" />
            <svg
              className="connected-man-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {connectedManPillars.map((pillar) => (
                <line
                  className="connected-man-line is-dormant"
                  key={`base-${pillar.id}`}
                  x1="50"
                  y1="50"
                  x2={pillar.x}
                  y2={pillar.y}
                />
              ))}
              {activePillar ? (
                <motion.line
                  className="connected-man-line is-active"
                  x1="50"
                  y1="50"
                  x2={activePillar.x}
                  y2={activePillar.y}
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.48 }}
                />
              ) : null}
              {activeRelationship
                ? activeRelationship.relatedPillarIds.map((pillarId, index) => {
                    const pillar = getPillar(pillarId);
                    if (!pillar || pillar.id === activePillar?.id) return null;
                    return (
                      <motion.line
                        className="connected-man-line is-cross-domain"
                        key={`${activeRelationship.id}-${pillar.id}`}
                        x1="50"
                        y1="50"
                        x2={pillar.x}
                        y2={pillar.y}
                        initial={
                          reducedMotion
                            ? false
                            : { pathLength: 0, opacity: 0 }
                        }
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          delay: reducedMotion ? 0 : index * 0.08,
                          duration: reducedMotion ? 0 : 0.5,
                        }}
                      />
                    );
                  })
                : null}
              {relationshipCapabilities.map((capability, index) => {
                const position = positions[index] ?? positions[0];
                const nextPosition = positions[index + 1];
                return (
                  <g key={`line-${capability.id}`}>
                    <motion.line
                      className="connected-man-line is-capability"
                      x1="50"
                      y1="50"
                      x2={position.x}
                      y2={position.y}
                      initial={
                        reducedMotion
                          ? false
                          : { pathLength: 0, opacity: 0 }
                      }
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        delay: reducedMotion ? 0 : index * 0.07,
                        duration: reducedMotion ? 0 : 0.44,
                      }}
                    />
                    {nextPosition ? (
                      <motion.line
                        className="connected-man-line is-sequence"
                        x1={position.x}
                        y1={position.y}
                        x2={nextPosition.x}
                        y2={nextPosition.y}
                        initial={
                          reducedMotion
                            ? false
                            : { pathLength: 0, opacity: 0 }
                        }
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          delay: reducedMotion ? 0 : 0.12 + index * 0.08,
                          duration: reducedMotion ? 0 : 0.5,
                        }}
                      />
                    ) : null}
                  </g>
                );
              })}
            </svg>

            <MemberCore
              member={member}
              active={Boolean(activePillar)}
              onReset={onResetView}
            />

            {connectedManPillars.map((pillar) => (
              <PillarNode
                key={pillar.id}
                pillar={pillar}
                active={activePillarId === pillar.id}
                related={relatedPillars.has(pillar.id)}
                explored={revealedRelationshipIds.includes(
                  pillar.defaultRelationshipId,
                )}
                atlasTarget={atlasTarget === pillar.id}
                reducedMotion={reducedMotion}
                onSelect={() => onSelectPillar(pillar.id)}
              />
            ))}

            {relationshipCapabilities.map((capability, index) => {
              const position = positions[index] ?? positions[0];
              return (
                <CapabilityNode
                  key={capability.id}
                  capability={capability}
                  x={position.x}
                  y={position.y}
                  active={activeCapabilityId === capability.id}
                  reducedMotion={reducedMotion}
                  onSelect={() => onSelectCapability(capability.id)}
                />
              );
            })}

            <div className="connected-man-field__instruction">
              <span>
                {atlasTarget
                  ? `Atlas selected · ${atlasTarget}`
                  : activePillar
                    ? `${activePillar.label} active`
                    : "Complete system"}
              </span>
              <strong>
                {activeRelationship?.path.join(" → ") ??
                  "Touch a pillar to reveal its influence"}
              </strong>
            </div>
          </div>

          {activePillar ? (
            <div
              className="connected-capability-dock"
              aria-label={`${activePillar.label} capabilities`}
            >
              <span>{activePillar.label} signals</span>
              <div>
                {activePillar.capabilities.map((capability) => (
                  <button
                    className={
                      activeCapabilityId === capability.id ? "is-active" : ""
                    }
                    type="button"
                    key={capability.id}
                    onClick={() => onSelectCapability(capability.id)}
                  >
                    <i>{capability.shortLabel}</i>
                    <span>{capability.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <RelationshipInsight
          relationship={activeRelationship}
          revealedRelationshipIds={revealedRelationshipIds}
          freeExploration={freeExploration}
          reducedMotion={reducedMotion}
          onSelectRelationship={onSelectRelationship}
        />
      </div>

      <div className="connected-man-disclosure">
        <span>Future capability demonstration</span>
        <p>
          This chamber uses simulated relationships only. It does not contain
          or infer private health, family, financial, or business data.
        </p>
      </div>
    </section>
  );
}
