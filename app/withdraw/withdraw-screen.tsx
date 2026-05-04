"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { JarStatusBadge } from "@/components/jar/jar-status-badge";
import { clearJarCoinCount } from "@/lib/jar-coin-count";
import {
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPressAlt,
} from "@/lib/primary-action-styles";
import {
  clearJarDeposits,
  DEPOSITS_UPDATED,
  notifyJarDepositsUpdated,
  readJarDeposits,
  savedFromDeposits,
  type JarDeposit,
} from "@/lib/jar-deposits";
import { readJarEarnedSnapshot } from "@/lib/jar-earned-snapshot";
import { stringifyGoalJarParams } from "@/lib/goal-jar-search-params";
import { jarBadgeStatusForActiveJar } from "@/lib/jar-badge-status";
import { writePostWithdrawalSnapshot } from "@/lib/post-withdrawal-snapshot";
import { resolveJarDisplayEmoji } from "@/lib/resolve-jar-display-emoji";

type Props = {
  goalName: string;
  targetAmount: number;
  continuingJarView: boolean;
  /** Emoji query from `/jar` so withdrawal UI matches the jar header. */
  emojiFromJar?: string | null;
};

function formatGrouped(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

/** Match `/jar` "You Earned" ticker (4 dp, 5s updates); falls back to 0 if snapshot missing. */
function formatTotalEarnedFromJar(usd: number): string {
  return `${usd.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })} USDC`;
}

export default function WithdrawScreen({
  goalName,
  targetAmount,
  continuingJarView,
  emojiFromJar = null,
}: Props) {
  const router = useRouter();
  const [deposits, setDeposits] = useState<JarDeposit[]>([]);
  const totalEarnedUsd = useMemo(
    () => readJarEarnedSnapshot() ?? 0,
    [],
  );

  const displayEmoji = useMemo(
    () => resolveJarDisplayEmoji(goalName, emojiFromJar),
    [goalName, emojiFromJar],
  );

  const reloadDeposits = useCallback(() => {
    setDeposits(readJarDeposits(goalName, targetAmount));
  }, [goalName, targetAmount]);

  useEffect(() => {
    reloadDeposits();
  }, [reloadDeposits]);

  useEffect(() => {
    const onUpdate = () => reloadDeposits();
    window.addEventListener(DEPOSITS_UPDATED, onUpdate);
    return () => window.removeEventListener(DEPOSITS_UPDATED, onUpdate);
  }, [reloadDeposits]);

  const savedAmount = useMemo(() => savedFromDeposits(deposits), [deposits]);
  const badgeStatus = useMemo(
    () => jarBadgeStatusForActiveJar({ savedAmount, targetAmount }),
    [savedAmount, targetAmount],
  );

  const backHref = `/jar?${stringifyGoalJarParams({
    goalName,
    targetAmount,
    continuing: continuingJarView || undefined,
    emoji: displayEmoji,
  })}`;

  const handleWithdraw = () => {
    const depositCopy = deposits.slice();
    const withdrawn = savedAmount;

    clearJarDeposits(goalName, targetAmount);
    clearJarCoinCount(goalName, targetAmount);
    notifyJarDepositsUpdated();

    writePostWithdrawalSnapshot({
      goalName,
      targetAmount,
      withdrawnAmount: withdrawn,
      deposits: depositCopy,
      withdrewAt: Date.now(),
      emoji: displayEmoji,
    });
      router.push(
        `/jar?${stringifyGoalJarParams({
          goalName,
          targetAmount,
          continuing: continuingJarView || undefined,
          emoji: displayEmoji,
        })}`,
      );
  };

  const flag = displayEmoji;

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
      <div className="relative flex min-h-screen w-full max-w-[420px] flex-col bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <header className="shrink-0 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="grid grid-cols-[2rem_1fr_2rem] items-center">
            <Link
              href={backHref}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-start text-neutral-950"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="48"
                  d="M328 112L184 256l144 144"
                />
              </svg>
            </Link>
            <h1 className="text-center font-outfit text-[22px] font-medium leading-none text-black">
              Break Jar
            </h1>
            <span aria-hidden className="h-8 w-8" />
          </div>
        </header>

        <div className="px-5">
          <div className="flex w-full items-center justify-between rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[24px] bg-[#F5F5F5] p-3">
                <span className="text-[24px] leading-none">{flag}</span>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <p className="font-outfit text-[18px] font-medium leading-none text-black">
                  {goalName}
                </p>
                <div className="flex items-center gap-1.5 text-[16px] leading-none">
                  <span className="font-outfit font-medium text-black">
                    ${formatGrouped(savedAmount)}
                  </span>
                  <span className="font-outfit font-normal text-[#9A9A9A]">
                    / {formatGrouped(targetAmount)}
                  </span>
                </div>
              </div>
            </div>
            <JarStatusBadge status={badgeStatus} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-5 px-5 py-16 text-center">
          <p className="text-center font-inter text-[16px] font-normal text-[#9A9A9A]">
            You Withdraw
          </p>
          <div className="flex items-center gap-1.5 font-outfit text-[32px] font-medium leading-none text-black">
            <span>{formatGrouped(savedAmount)}</span>
            <span>USDC</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-6 px-5 pt-6">
          <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#F5F5F5] px-4 py-5">
            <div className="flex w-full items-center justify-between">
              <span className="font-inter text-[14px] font-normal text-[#9A9A9A]">
                Total Earned
              </span>
              <span className="font-outfit text-[18px] font-medium text-black">
                {formatTotalEarnedFromJar(totalEarnedUsd)}
              </span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="font-inter text-[14px] font-normal text-[#9A9A9A]">
                Withdrawal Fee
              </span>
              <span className="font-outfit text-[18px] font-medium text-black">
                Free
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            className={[
              "flex h-[57px] w-full items-center justify-center rounded-[20px]",
              primaryActionBgShadow,
              primaryActionLabel,
              primaryActionPressAlt,
            ].join(" ")}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
