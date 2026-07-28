"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import styles from "./app-device-prologue.module.css";

export type DeviceProloguePhase = "arrival" | "online" | "zoom";

export function AppDevicePrologue({
  firstName,
  memberNumber,
  phase,
  reducedMotion,
}: {
  firstName: string;
  memberNumber: string;
  phase: DeviceProloguePhase;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className={styles.prologue}
      data-phase={phase}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6 }}
    >
      <div className={styles.environment} aria-hidden="true">
        <i />
        <i />
        <i />
        <span />
      </div>

      <div className={styles.prologueCopy}>
        <span>Private member application</span>
        <strong>Currently in development</strong>
        <small>Concept interface · Founding demonstration</small>
      </div>

      <div className={styles.deviceScene}>
        <div className={styles.deviceTelemetry} aria-hidden="true">
          <span>LS / MOBILE SYSTEM</span>
          <i />
          <span>BUILD 001 · PRIVATE</span>
        </div>

        <div className={styles.phone}>
          <i className={styles.sideButton} />
          <i className={styles.volumeButton} />
          <div className={styles.phoneFrame}>
            <div className={styles.phoneHighlight} />
            <div className={styles.dynamicIsland}>
              <i />
              <span />
            </div>
            <div className={styles.phoneScreen}>
              <div className={styles.screenGrid} aria-hidden="true" />
              <div className={styles.mobileStatus}>
                <span>9:41</span>
                <div><i /><i /><i /></div>
              </div>
              <div className={styles.mobileBrand}>
                <Image src="/icon.png" alt="" width={34} height={34} priority />
                <div>
                  <strong>Legacy Sanctum</strong>
                  <span>Member OS</span>
                </div>
                <i />
              </div>
              <div className={styles.mobileWelcome}>
                <span>Command Center</span>
                <h3>Welcome, {firstName}.</h3>
                <p>One private intelligence for the whole man.</p>
              </div>
              <div className={styles.mobileAtlas}>
                <div className={styles.mobileOrb}><i /><i /><span>A</span></div>
                <div>
                  <small>Atlas priority</small>
                  <strong>Protect the recovery window.</strong>
                  <span>03 signals connected</span>
                </div>
              </div>
              <div className={styles.mobilePillars}>
                {["V", "M", "B", "L"].map((pillar, index) => (
                  <div key={pillar}>
                    <span>{pillar}</span>
                    <i style={{ height: `${54 + index * 9}%` }} />
                  </div>
                ))}
              </div>
              <div className={styles.mobileDock}>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className={styles.screenActivation} aria-hidden="true">
                <Image src="/icon.png" alt="" width={72} height={72} />
                <span>Legacy Sanctum</span>
                <strong>Member system initializing</strong>
                <i />
              </div>
              <div className={styles.screenPortal} aria-hidden="true" />
            </div>
            <div className={styles.homeIndicator} />
          </div>
        </div>

        <div className={styles.deviceShadow} aria-hidden="true"><i /></div>
      </div>

      <div className={styles.systemReadout}>
        <div>
          <span>Form</span>
          <strong>Native member application</strong>
        </div>
        <i />
        <div>
          <span>Status</span>
          <strong>{phase === "arrival" ? "Approaching" : phase === "online" ? "Interface online" : "Entering system"}</strong>
        </div>
        <i />
        <div>
          <span>Member</span>
          <strong>{memberNumber}</strong>
        </div>
      </div>
    </motion.div>
  );
}
