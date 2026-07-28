"use client";

import { useCallback, useMemo, useState } from "react";

import type {
  FoundingPrivilegeId,
  PostDemonstrationStage,
} from "@/data/post-demonstration/bridge-data";

const STAGE_ORDER: readonly PostDemonstrationStage[] = [
  "transition",
  "debrief",
  "member-reveal",
  "founding-position",
  "product-connection",
  "next-steps",
  "founder-message",
  "final-induction",
  "sms-ready",
] as const;

export function usePostDemonstration() {
  const [stage, setStage] =
    useState<PostDemonstrationStage>("transition");
  const [openedPrivilegeIds, setOpenedPrivilegeIds] = useState<
    FoundingPrivilegeId[]
  >([]);
  const [viewedProductIds, setViewedProductIds] = useState<string[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [narrationRevision, setNarrationRevision] = useState(0);
  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [smsLaunchAttempted, setSmsLaunchAttempted] = useState(false);
  const [smsFallbackVisible, setSmsFallbackVisible] = useState(false);

  const stageIndex = STAGE_ORDER.indexOf(stage);

  const goToStage = useCallback((nextStage: PostDemonstrationStage) => {
    setStage(nextStage);
    setNarrationRevision((current) => current + 1);
  }, []);

  const advance = useCallback(() => {
    setStage((currentStage) => {
      const currentIndex = STAGE_ORDER.indexOf(currentStage);
      return STAGE_ORDER[Math.min(currentIndex + 1, STAGE_ORDER.length - 1)];
    });
    setNarrationRevision((current) => current + 1);
  }, []);

  const openPrivilege = useCallback((privilegeId: FoundingPrivilegeId) => {
    setOpenedPrivilegeIds((current) =>
      current.includes(privilegeId) ? current : [...current, privilegeId],
    );
  }, []);

  const viewProduct = useCallback((productId: string, index: number) => {
    setSelectedProductIndex(index);
    setViewedProductIds((current) =>
      current.includes(productId) ? current : [...current, productId],
    );
  }, []);

  return useMemo(
    () => ({
      stage,
      stageIndex,
      stageCount: STAGE_ORDER.length,
      openedPrivilegeIds,
      viewedProductIds,
      selectedProductIndex,
      narrationRevision,
      captionsVisible,
      smsLaunchAttempted,
      smsFallbackVisible,
      advance,
      goToStage,
      openPrivilege,
      viewProduct,
      replayNarration: () =>
        setNarrationRevision((current) => current + 1),
      toggleCaptions: () => setCaptionsVisible((current) => !current),
      markSmsLaunchAttempted: () => setSmsLaunchAttempted(true),
      showSmsFallback: () => setSmsFallbackVisible(true),
      hideSmsFallback: () => setSmsFallbackVisible(false),
    }),
    [
      advance,
      captionsVisible,
      goToStage,
      narrationRevision,
      openPrivilege,
      openedPrivilegeIds,
      selectedProductIndex,
      smsFallbackVisible,
      smsLaunchAttempted,
      stage,
      stageIndex,
      viewProduct,
      viewedProductIds,
    ],
  );
}
