"use client";

import { useEffect, useRef, useState } from "react";

const ATLAS_TEST_NARRATION =
  "Identity confirmed. Welcome, Blair. You have been selected as Legacy Sanctum Founding Member Zero Zero One. The Atlas Demonstration is ready.";

type PlaybackState =
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

export function AtlasVoiceTest() {
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>("idle");
  const [error, setError] = useState("");
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const requestInFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      audioRef.current?.pause();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      audioRef.current = null;
      objectUrlRef.current = null;
    };
  }, []);

  function releaseCurrentAudio() {
    audioRef.current?.pause();
    audioRef.current = null;
    setHasAudio(false);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  async function generateAndPlay() {
    if (requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setError("");
    setPlaybackState("loading");
    releaseCurrentAudio();

    try {
      const response = await fetch("/api/atlas/narration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ATLAS_TEST_NARRATION }),
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

      const objectUrl = URL.createObjectURL(audioBlob);
      if (!mountedRef.current) {
        URL.revokeObjectURL(objectUrl);
        return;
      }

      const audio = new Audio(objectUrl);
      audio.preload = "auto";
      objectUrlRef.current = objectUrl;
      audioRef.current = audio;
      setHasAudio(true);

      audio.addEventListener("ended", () => {
        if (mountedRef.current) setPlaybackState("ended");
      });
      audio.addEventListener("error", () => {
        if (!mountedRef.current) return;
        setError("The generated Atlas audio could not be played.");
        setPlaybackState("error");
      });

      try {
        await audio.play();
        if (mountedRef.current) setPlaybackState("playing");
      } catch {
        if (!mountedRef.current) return;
        setPlaybackState("ready");
        setError(
          "The audio is ready, but the browser blocked playback. Tap Replay to begin.",
        );
      }
    } catch (caught) {
      if (!mountedRef.current) return;
      setError(
        caught instanceof Error
          ? caught.message
          : "Atlas voice generation failed. Please try again.",
      );
      setPlaybackState("error");
    } finally {
      requestInFlightRef.current = false;
    }
  }

  function pause() {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    audio.pause();
    setPlaybackState("paused");
  }

  async function playFromCurrentPosition() {
    const audio = audioRef.current;
    if (!audio) return;

    setError("");
    try {
      await audio.play();
      setPlaybackState("playing");
    } catch {
      setError("Atlas audio could not resume. Please try Replay.");
      setPlaybackState("error");
    }
  }

  async function replay() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    await playFromCurrentPosition();
  }

  const isLoading = playbackState === "loading";
  const status =
    playbackState === "loading"
      ? "Generating Atlas voice…"
      : playbackState === "playing"
        ? "Atlas is speaking"
        : playbackState === "paused"
          ? "Playback paused"
          : playbackState === "ended"
            ? "Playback complete"
            : playbackState === "ready"
              ? "Audio ready"
              : "Ready for a one-line voice test";

  return (
    <aside className="atlas-voice-test" aria-labelledby="atlas-test-title">
      <div className="atlas-voice-test__heading">
        <div>
          <span>Temporary voice test</span>
          <h2 id="atlas-test-title">Hear Atlas</h2>
        </div>
        <span className="atlas-voice-test__status" aria-live="polite">
          {status}
        </span>
      </div>

      <p className="atlas-voice-test__caption">
        <span>Caption</span>
        {ATLAS_TEST_NARRATION}
      </p>

      <div className="atlas-voice-test__controls">
        <button
          className="control-button control-button--next"
          type="button"
          onClick={generateAndPlay}
          disabled={isLoading}
        >
          {isLoading ? "Generating…" : "Generate and Play"}
        </button>
        {hasAudio ? (
          <>
            {playbackState === "playing" ? (
              <button className="control-button" type="button" onClick={pause}>
                Pause
              </button>
            ) : (
              <button
                className="control-button"
                type="button"
                onClick={playFromCurrentPosition}
              >
                Resume
              </button>
            )}
            <button className="control-button" type="button" onClick={replay}>
              Replay
            </button>
          </>
        ) : null}
      </div>

      {error ? (
        <p className="atlas-voice-test__error" role="alert">
          {error}
        </p>
      ) : null}
    </aside>
  );
}
