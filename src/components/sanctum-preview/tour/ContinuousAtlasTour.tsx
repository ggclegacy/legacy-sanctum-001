"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AtlasOrb } from "@/components/sanctum-preview/atlas/AtlasOrb";
import {
  personalizeTourNarration,
  platformTourChapters,
  platformTourPrologue,
} from "@/data/preview/platform-tour";
import { useAtlasNarration } from "@/hooks/useAtlasNarration";

import {
  AppDevicePrologue,
  type DeviceProloguePhase,
} from "./AppDevicePrologue";
import { AtlasWholeManIntelligence } from "./AtlasWholeManIntelligence";
import { TourVisual } from "./TourVisuals";
import styles from "./continuous-atlas-tour.module.css";

const CHAPTER_TRANSITION_DELAY_MS = 900;
const COMPLETION_RETURN_DELAY_MS = 7_000;

export function ContinuousAtlasTour({
  firstName,
  fullName,
  memberNumber,
  memberType,
  narrationEnabled,
  onReturnToInvitation,
}: {
  firstName: string;
  fullName: string;
  memberNumber: string;
  memberType: string;
  narrationEnabled: boolean;
  onReturnToInvitation: () => void;
}) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [playbackRevision, setPlaybackRevision] = useState(0);
  const [tourPaused, setTourPaused] = useState(false);
  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [tourComplete, setTourComplete] = useState(false);
  const [prologueVisible, setPrologueVisible] = useState(true);
  const [prologuePhase, setProloguePhase] =
    useState<DeviceProloguePhase>("arrival");
  const reducedMotion = Boolean(useReducedMotion());
  const advanceLockRef = useRef(false);
  const prologueExitTimerRef = useRef<number | null>(null);
  const {
    status,
    error,
    hasAudio,
    speak,
    pause,
    resume,
    replay,
    stop,
  } = useAtlasNarration();

  const chapter = platformTourChapters[chapterIndex];
  const narration = useMemo(
    () =>
      personalizeTourNarration(
        prologueVisible ? platformTourPrologue.narration : chapter.narration,
        firstName,
      ),
    [chapter.narration, firstName, prologueVisible],
  );

  const exitPrologue = useCallback(() => {
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;
    stop();
    setProloguePhase("zoom");
    if (prologueExitTimerRef.current) {
      window.clearTimeout(prologueExitTimerRef.current);
    }
    prologueExitTimerRef.current = window.setTimeout(
      () => {
        setPrologueVisible(false);
        setProloguePhase("arrival");
        setPlaybackRevision((current) => current + 1);
        advanceLockRef.current = false;
        prologueExitTimerRef.current = null;
      },
      reducedMotion ? 80 : 1_650,
    );
  }, [reducedMotion, stop]);

  const advance = useCallback(() => {
    if (prologueVisible) {
      exitPrologue();
      return;
    }
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;
    stop();

    if (chapterIndex >= platformTourChapters.length - 1) {
      setTourComplete(true);
      return;
    }

    setChapterIndex((current) => current + 1);
    setPlaybackRevision((current) => current + 1);
    window.setTimeout(() => {
      advanceLockRef.current = false;
    }, 120);
  }, [chapterIndex, exitPrologue, prologueVisible, stop]);

  useEffect(() => {
    advanceLockRef.current = false;
  }, [chapterIndex, prologueVisible]);

  useEffect(() => {
    if (
      !prologueVisible ||
      tourPaused ||
      prologuePhase !== "arrival"
    ) {
      return;
    }
    const timer = window.setTimeout(
      () => setProloguePhase("online"),
      reducedMotion ? 0 : 1_250,
    );
    return () => window.clearTimeout(timer);
  }, [prologuePhase, prologueVisible, reducedMotion, tourPaused]);

  useEffect(() => {
    if (tourPaused || tourComplete) {
      return;
    }

    if (!narrationEnabled) {
      stop();
      return;
    }

    void speak(
      narration,
      prologueVisible
        ? `continuous-platform-tour:app-prologue:${playbackRevision}`
        : `continuous-platform-tour:${chapter.id}:${playbackRevision}`,
    );
  }, [
    chapter.id,
    narration,
    narrationEnabled,
    playbackRevision,
    prologueVisible,
    speak,
    stop,
    tourComplete,
    tourPaused,
  ]);

  useEffect(() => {
    if (tourPaused || tourComplete) return;

    if (narrationEnabled && status === "ended") {
      const timer = window.setTimeout(advance, CHAPTER_TRANSITION_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    if (!narrationEnabled || status === "error") {
      const timer = window.setTimeout(
        advance,
        prologueVisible
          ? platformTourPrologue.silentDurationMs
          : chapter.silentDurationMs,
      );
      return () => window.clearTimeout(timer);
    }
  }, [
    advance,
    chapter.silentDurationMs,
    narrationEnabled,
    prologueVisible,
    status,
    tourComplete,
    tourPaused,
  ]);

  useEffect(() => {
    if (!tourComplete) return;
    const timer = window.setTimeout(
      onReturnToInvitation,
      COMPLETION_RETURN_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [onReturnToInvitation, tourComplete]);

  useEffect(
    () => () => {
      stop();
      if (prologueExitTimerRef.current) {
        window.clearTimeout(prologueExitTimerRef.current);
      }
    },
    [stop],
  );

  const handlePause = () => {
    setTourPaused(true);
    if (status === "playing") {
      pause();
    } else if (status === "loading") {
      stop();
    }
  };

  const handleResume = () => {
    setTourPaused(false);
    if (hasAudio && (status === "paused" || status === "ready")) {
      void resume();
      return;
    }
    setPlaybackRevision((current) => current + 1);
  };

  const handleReplay = () => {
    setTourPaused(false);
    if (hasAudio) {
      void replay();
      return;
    }
    setPlaybackRevision((current) => current + 1);
  };

  const handleRestart = () => {
    stop();
    if (prologueExitTimerRef.current) {
      window.clearTimeout(prologueExitTimerRef.current);
      prologueExitTimerRef.current = null;
    }
    advanceLockRef.current = false;
    setTourComplete(false);
    setTourPaused(false);
    setChapterIndex(0);
    setPrologueVisible(true);
    setProloguePhase("arrival");
    setPlaybackRevision((current) => current + 1);
  };

  const voiceState =
    status === "loading"
      ? "Atlas is preparing"
      : status === "playing"
        ? "Atlas speaking"
        : status === "paused"
          ? "Tour paused"
          : status === "ready"
            ? "Atlas ready"
            : status === "error"
              ? "Continuing with captions"
              : narrationEnabled
                ? "Atlas connected"
                : "Caption-led preview";

  return (
    <section
      className={`sanctum-preview-experience ${styles.tour}`}
      data-active-chapter={prologueVisible ? "app-prologue" : chapter.id}
      aria-label="Legacy Sanctum continuous future platform preview"
    >
      <div className={styles.ambient} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className={styles.header}>
        <div className={styles.brand}>
          <Image
            src="/icon.png"
            alt=""
            width={42}
            height={42}
            priority
          />
          <div>
            <strong>Legacy Sanctum</strong>
            <span>
              {prologueVisible
                ? "Member application · In development"
                : "Future Member OS · Private demonstration"}
            </span>
          </div>
        </div>
        <div className={styles.systemStatus} aria-label="Atlas system connected">
          <i aria-hidden="true" />
          <span>Atlas system</span>
          <strong>Connected</strong>
        </div>
        <div className={styles.identity}>
          <span>{memberType}</span>
          <strong>{fullName}</strong>
          <small>Member {memberNumber}</small>
        </div>
      </header>

      <div
        className={styles.body}
        style={
          prologueVisible
            ? { gridTemplateColumns: "minmax(0, 1fr)" }
            : undefined
        }
      >
        {!prologueVisible ? (
          <aside className={styles.chapterRail} aria-label="Tour progress">
            <span className={styles.railLabel}>System map</span>
            <div className={styles.chapterList}>
              {platformTourChapters.map((item, index) => {
                const state =
                  index === chapterIndex
                    ? "active"
                    : index < chapterIndex
                      ? "complete"
                      : "upcoming";
                return (
                  <div
                    className={styles.chapterItem}
                    data-state={state}
                    key={item.id}
                  >
                    <span>{item.number}</span>
                    <strong>{item.navLabel}</strong>
                    <i aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </aside>
        ) : null}

        <main className={styles.stage}>
          <div className={styles.stageFrame} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <AnimatePresence mode="wait">
            {tourComplete ? (
              <motion.div
                className={styles.completion}
                key="tour-complete"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <AtlasOrb active reducedMotion={reducedMotion} />
                <span>Atlas demonstration complete</span>
                <h2>The future is not another app.</h2>
                <p>It is one private intelligence built around the whole man.</p>
                <div>
                  <button type="button" onClick={onReturnToInvitation}>
                    Return to invitation
                  </button>
                  <button type="button" onClick={handleRestart}>
                    Replay the experience
                  </button>
                </div>
              </motion.div>
            ) : prologueVisible ? (
              <AppDevicePrologue
                firstName={firstName}
                memberNumber={memberNumber}
                phase={prologuePhase}
                reducedMotion={reducedMotion}
              />
            ) : (
              <motion.div
                className={styles.chapter}
                key={chapter.id}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.45 }}
              >
                <div className={styles.chapterHeading}>
                  <div>
                    <span>{chapter.eyebrow}</span>
                    <h2>{chapter.title}</h2>
                    <small>
                      Live future capability · Atlas-guided demonstration
                    </small>
                  </div>
                  <div className={styles.chapterCounter}>
                    <strong>{chapter.number}</strong>
                    <span>/ {String(platformTourChapters.length).padStart(2, "0")}</span>
                  </div>
                </div>
                {chapter.id === "atlas-intelligence" ? (
                  <AtlasWholeManIntelligence
                    active={!tourPaused}
                    firstName={firstName}
                    reducedMotion={reducedMotion}
                    speaking={status === "loading" || status === "playing"}
                  />
                ) : (
                  <TourVisual
                    chapterId={chapter.id}
                    firstName={firstName}
                    reducedMotion={reducedMotion}
                  />
                )}
                {chapter.disclosure ? (
                  <span className={styles.disclosure}>{chapter.disclosure}</span>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {!tourComplete ? (
        <footer className={styles.atlasBar}>
          <div className={styles.atlasIdentity}>
            <AtlasOrb
              active={status === "loading" || status === "playing"}
              reducedMotion={reducedMotion}
            />
            <div>
              <strong>Atlas</strong>
              <span>{voiceState}</span>
            </div>
          </div>

          <div className={styles.captionArea}>
            <div className={styles.voiceWave} aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            {captionsVisible ? <p>{narration}</p> : <p>Captions hidden</p>}
            {error ? <small role="status">{error}</small> : null}
          </div>

          <div className={styles.controls}>
            {tourPaused || status === "paused" || status === "ready" ? (
              <button type="button" onClick={handleResume}>
                Resume
              </button>
            ) : (
              <button type="button" onClick={handlePause}>
                Pause
              </button>
            )}
            <button type="button" onClick={handleReplay}>
              Replay
            </button>
            <button type="button" onClick={advance}>
              Skip
            </button>
            <button
              type="button"
              onClick={() => setCaptionsVisible((current) => !current)}
            >
              {captionsVisible ? "Hide captions" : "Show captions"}
            </button>
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <motion.i
              animate={{
                width: prologueVisible
                  ? "0%"
                  : `${((chapterIndex + 1) / platformTourChapters.length) * 100}%`,
              }}
              transition={{ duration: reducedMotion ? 0 : 0.5 }}
            />
          </div>
        </footer>
      ) : null}
    </section>
  );
}
