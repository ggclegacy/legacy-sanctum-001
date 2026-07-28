"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createSmsLink,
  detectSmsPlatform,
} from "@/lib/messaging/create-sms-link";

const LAUNCH_LOCK_MS = 1_800;
const FALLBACK_CHECK_MS = 1_400;

export function useSmsLaunch({
  phoneNumber,
  message,
  onFallback,
}: {
  phoneNumber: string | null;
  message: string;
  onFallback: () => void;
}) {
  const [launching, setLaunching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const launchLockRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    },
    [],
  );

  const launch = useCallback(() => {
    if (launchLockRef.current) return false;
    launchLockRef.current = true;
    setLaunching(true);
    setCopied(false);

    const platform = detectSmsPlatform(window.navigator.userAgent);
    const smsUrl = phoneNumber
      ? createSmsLink({ phoneNumber, message, platform })
      : null;

    if (!smsUrl) {
      setStatus("Your message is ready. SMS opening is unavailable.");
      setLaunching(false);
      onFallback();
      const unlockTimer = window.setTimeout(() => {
        launchLockRef.current = false;
      }, LAUNCH_LOCK_MS);
      timersRef.current.push(unlockTimer);
      return false;
    }

    setStatus("Opening Messages. Review the message before sending.");
    window.location.href = smsUrl;

    const fallbackTimer = window.setTimeout(() => {
      setLaunching(false);
      launchLockRef.current = false;
      if (document.visibilityState === "visible") {
        setStatus("Your message is ready.");
        onFallback();
      }
    }, FALLBACK_CHECK_MS);
    timersRef.current.push(fallbackTimer);
    return true;
  }, [message, onFallback, phoneNumber]);

  const copyMessage = useCallback(async () => {
    setCopied(false);
    try {
      await window.navigator.clipboard.writeText(message);
      setCopied(true);
      setStatus("Message copied. You can paste it into Messages.");
    } catch {
      setStatus("Copy is unavailable. Select the prepared message below.");
    }
  }, [message]);

  return {
    launching,
    copied,
    status,
    launch,
    copyMessage,
  };
}
