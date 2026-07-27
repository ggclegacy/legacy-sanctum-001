"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AtlasPlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ready"
  | "ended"
  | "error";

type ErrorPayload = {
  message?: string;
};

export function useAtlasNarration() {
  const [status, setStatus] = useState<AtlasPlaybackStatus>("idle");
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const audioCacheRef = useRef(new Map<string, Blob>());
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestSequenceRef = useRef(0);
  const requestedCueRef = useRef<string | null>(null);
  const currentCueRef = useRef<string | null>(null);
  const currentTextRef = useRef<string | null>(null);
  const mutedRef = useRef(false);
  const mountedRef = useRef(false);

  const releaseAudioSource = useCallback((updateState = true) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (updateState) setHasAudio(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const audioCache = audioCacheRef.current;
    const audio = new Audio();
    audio.preload = "auto";
    audio.onended = () => {
      if (mountedRef.current) setStatus("ended");
    };
    audio.onerror = () => {
      if (!mountedRef.current) return;
      setError("The generated Atlas audio could not be played.");
      setStatus("error");
    };
    audioRef.current = audio;

    return () => {
      mountedRef.current = false;
      requestSequenceRef.current += 1;
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      releaseAudioSource(false);
      audioRef.current = null;
      audioCache.clear();
    };
  }, [releaseAudioSource]);

  const playBlob = useCallback(
    async (blob: Blob, text: string, cueId: string) => {
      const audio = audioRef.current;
      if (!audio || !mountedRef.current) return;

      releaseAudioSource();
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;
      currentCueRef.current = cueId;
      currentTextRef.current = text;
      audio.src = objectUrl;
      audio.muted = mutedRef.current;
      audio.load();
      setHasAudio(true);

      try {
        await audio.play();
        if (mountedRef.current) setStatus("playing");
      } catch {
        if (!mountedRef.current) return;
        setStatus("ready");
        setError(
          "Atlas is ready, but the browser blocked playback. Tap Replay to begin.",
        );
      }
    },
    [releaseAudioSource],
  );

  const speak = useCallback(
    async (text: string, cueId: string, force = false) => {
      const normalizedText = text.trim();
      if (!normalizedText || !mountedRef.current) return;
      if (!force && requestedCueRef.current === cueId) return;

      requestedCueRef.current = cueId;
      requestSequenceRef.current += 1;
      const requestSequence = requestSequenceRef.current;
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setError("");

      const cachedAudio = audioCacheRef.current.get(normalizedText);
      if (cachedAudio) {
        await playBlob(cachedAudio, normalizedText, cueId);
        return;
      }

      releaseAudioSource();
      setStatus("loading");
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/atlas/narration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: normalizedText }),
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response
            .json()
            .catch(() => null)) as ErrorPayload | null;
          throw new Error(
            payload?.message ??
              "Atlas voice generation failed. Please try again.",
          );
        }

        const audioBlob = await response.blob();
        if (!audioBlob.size) {
          throw new Error("Atlas returned an empty audio response.");
        }

        if (
          !mountedRef.current ||
          requestSequence !== requestSequenceRef.current
        ) {
          return;
        }

        audioCacheRef.current.set(normalizedText, audioBlob);
        await playBlob(audioBlob, normalizedText, cueId);
      } catch (caught) {
        if (
          controller.signal.aborted ||
          !mountedRef.current ||
          requestSequence !== requestSequenceRef.current
        ) {
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Atlas voice generation failed. Please try again.",
        );
        setStatus("error");
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [playBlob, releaseAudioSource],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    audio.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    setError("");
    try {
      await audio.play();
      if (mountedRef.current) setStatus("playing");
    } catch {
      if (!mountedRef.current) return;
      setError("Atlas audio could not resume. Tap Replay to try again.");
      setStatus("error");
    }
  }, [hasAudio]);

  const replay = useCallback(async () => {
    const audio = audioRef.current;
    if (audio && hasAudio) {
      audio.currentTime = 0;
      await resume();
      return;
    }

    const currentText = currentTextRef.current;
    const currentCue = currentCueRef.current;
    if (currentText && currentCue) {
      await speak(currentText, `${currentCue}:replay`, true);
    }
  }, [hasAudio, resume, speak]);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const stop = useCallback(() => {
    requestSequenceRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    requestedCueRef.current = null;
    currentCueRef.current = null;
    currentTextRef.current = null;
    releaseAudioSource();
    setError("");
    setStatus("idle");
  }, [releaseAudioSource]);

  return {
    status,
    error,
    muted,
    hasAudio,
    speak,
    pause,
    resume,
    replay,
    toggleMuted,
    stop,
  };
}
