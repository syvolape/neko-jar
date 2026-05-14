"use client";

/** Jar-specific UI module: jar visual. */

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { JarDepositCoinDrop } from "@/components/jar/jar-deposit-coin-drop";
import { EarnRatePromoCard } from "@/components/ui/earn-rate-promo-card";
import { sessionPendingCoinDrop } from "@/lib/jar-deposits";
import type { JarViewState } from "@/lib/jar-state";

const STATES = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function closestJarState(percent: number): number {
  return STATES.reduce((prev, curr) =>
    Math.abs(curr - percent) < Math.abs(prev - percent) ? curr : prev,
  );
}

function jarStateForPercent(percent: number): number {
  // Special early-progress illustration: only for progress between 0% and 3%.
  if (percent > 0 && percent < 3) return 1;
  return closestJarState(percent);
}

type Props = {
  jarState: JarViewState;
  progress: number;
  targetAmount: number;
};

/** Jar illustration + coins; earn promo when empty. No success/celebration UI. */
export function JarVisual({ jarState, progress, targetAmount }: Props) {
  const [pendingDeposit, setPendingDeposit] = useState<number | null>(null);

  const jarSrc = useMemo(() => {
    // We use a small fixed sprite set, so progress is snapped to the closest illustration state.
    const percent = clampPercent(progress * 100);
    const state = jarStateForPercent(percent);
    return `/jar-${state}.svg`;
  }, [progress]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        // This one-time value is set by the deposit screen so the jar can animate the incoming coins.
        const raw = sessionStorage.getItem(sessionPendingCoinDrop);
        if (raw == null || raw === "") return;
        sessionStorage.removeItem(sessionPendingCoinDrop);
        const dep = Number(raw);
        if (!Number.isFinite(dep) || dep <= 0) return;
        setPendingDeposit(dep);
      } catch {
        // ignore quota / privacy mode
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  const onDepositDropComplete = useCallback(() => {
    setPendingDeposit(null);
  }, []);

  return (
    <>
      <div className="mt-5 flex w-full justify-center">
        <div className="relative h-[280px] w-[280px] shrink-0 overflow-visible">
          {pendingDeposit != null ? (
            <JarDepositCoinDrop
              depositAmount={pendingDeposit}
              goalAmount={targetAmount}
              onComplete={onDepositDropComplete}
            />
          ) : null}
          <Image
            src={jarSrc}
            alt=""
            width={280}
            height={280}
            className="relative z-10 h-[280px] w-[280px] object-contain"
            aria-hidden
          />
        </div>
      </div>

      {jarState === "empty" ? (
        <EarnRatePromoCard className="mt-5 w-full transition-all duration-300" />
      ) : null}
    </>
  );
}
