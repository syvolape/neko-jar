"use client";

/** Jar-specific UI module: jar stats. */

import { useState } from "react";

import { EarnRateInfoSheet } from "@/components/ui/earn-rate-info-sheet";
import {
  EarnedAmountDisplay,
  formatEarnedFourDecimals,
} from "@/components/jar/earned-amount-display";
import { InfoIcon } from "@/components/jar/jar-inline-icons";
import type { JarViewState } from "@/lib/jar-state";

type Props = {
  jarState: JarViewState;
  earnedAmount: number;
  previousEarnedAmount: number;
};

/**
 * Earn rate metrics (hidden when empty or post-withdraw).
 */
export function JarStats({
  jarState,
  earnedAmount,
  previousEarnedAmount,
}: Props) {
  const [earnRateInfoOpen, setEarnRateInfoOpen] = useState(false);

  // Empty and post-withdraw states intentionally hide this card so it only appears for active jars.
  if (jarState === "empty" || jarState === "post-withdraw") {
    return null;
  }

  return (
    <>
      <div className="mt-5 flex w-full items-center gap-6 rounded-2xl bg-white px-4 py-5 transition-all duration-300">
        <div className="min-w-0 flex-1">
          <p className="font-inter text-[14px] text-[#9A9A9A]">You Earned</p>
          <div className="mt-1 flex items-center gap-2">
            <p
              className="inline-flex min-w-0 items-baseline gap-0 font-outfit text-[18px] font-medium leading-none text-[#11AE36]"
              aria-label={`You earned +$${formatEarnedFourDecimals(earnedAmount)}`}
            >
              <span aria-hidden>+$</span>
              <EarnedAmountDisplay
                earnedAmount={earnedAmount}
                previousEarnedAmount={previousEarnedAmount}
              />
            </p>
            <span
              className="relative inline-flex size-[14px] animate-pulse items-center justify-center rounded-full bg-[#11AE36]/25"
              aria-label="Earnings active"
            >
              <span className="size-[6px] rounded-full bg-[#11AE36]" />
            </span>
          </div>
        </div>
        <div className="h-[46px] w-px bg-[#DBDBDB]" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-inter text-[14px] text-[#9A9A9A]">Earn Rate</p>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <p className="font-outfit text-[18px] font-medium leading-none text-neutral-950">
              5% per year
            </p>
            <button
              type="button"
              onClick={() => setEarnRateInfoOpen(true)}
              className="flex shrink-0 rounded-full p-0.5 text-[#9A9A9A] transition hover:opacity-80 active:opacity-70"
              aria-label="About earn rate"
            >
              <InfoIcon className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>
      <EarnRateInfoSheet
        open={earnRateInfoOpen}
        onOpenChange={setEarnRateInfoOpen}
      />
    </>
  );
}
