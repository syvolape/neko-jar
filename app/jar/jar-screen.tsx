"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { JarActions } from "@/components/jar/jar-actions";
import { JarLeaveGoalSheet } from "@/components/jar/jar-leave-goal-sheet";
import { JarAmount } from "@/components/jar/jar-amount";
import { JarPeekCat } from "@/components/jar/jar-peek-cat";
import { JarHeader } from "@/components/jar/jar-header";
import { JarHistory } from "@/components/jar/jar-history";
import { JarPostWithdrawScreen } from "@/components/jar/jar-post-withdraw-screen";
import { JarStats } from "@/components/jar/jar-stats";
import { JarVisual } from "@/components/jar/jar-visual";
import { DEPOSITS_UPDATED, readJarDeposits, savedFromDeposits, type JarDeposit } from "@/lib/jar-deposits";
import {
  jarPreviewMockCompletedJarsHistory,
  jarPreviewMockDeposits,
  jarPreviewMockPostWithdrawSnapshot,
  jarPreviewMockSavedAmount,
  parseJarPreviewState,
} from "@/lib/jar-preview";
import { deriveJarState, type JarViewState } from "@/lib/jar-state";
import {
  peekAndDrainPostWithdrawalSnapshot,
  readCompletedJarsHistory,
  type PostWithdrawalSnapshot,
} from "@/lib/post-withdrawal-snapshot";
import { writeJarEarnedSnapshot } from "@/lib/jar-earned-snapshot";
import { formatUsdDisplay, remainingToGoal } from "@/lib/format-usd";
import { stringifyGoalJarParams } from "@/lib/goal-jar-search-params";
import { resolveJarDisplayEmoji } from "@/lib/resolve-jar-display-emoji";

function successHref(goalName: string, targetAmount: number): string {
  return `/success?goal=${encodeURIComponent(goalName)}&target=${targetAmount}`;
}

type Props = {
  goalName: string;
  targetAmount: number;
  /** After goal success, user returns with `continuing=1` (no redirect to /success). */
  continuingSuppressed: boolean;
};

export default function JarScreen({
  goalName,
  targetAmount,
  continuingSuppressed,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewState = useMemo(
    () => parseJarPreviewState(searchParams.get("state")),
    [searchParams],
  );

  const emojiParam = searchParams.get("emoji");
  const flagEmoji = useMemo(
    () => resolveJarDisplayEmoji(goalName, emojiParam),
    [goalName, emojiParam],
  );
  const [deposits, setDeposits] = useState<JarDeposit[]>([]);
  const [earnedLive, setEarnedLive] = useState<{ prev: number; cur: number }>({
    prev: 0,
    cur: 0,
  });
  const [withdrawSnapshot, setWithdrawSnapshot] =
    useState<PostWithdrawalSnapshot | null>(null);
  const [hasEverReachedTarget, setHasEverReachedTarget] = useState(
    continuingSuppressed,
  );
  const [leaveGoalSheetOpen, setLeaveGoalSheetOpen] = useState(false);

  const postWithdrawDrainOnce = useRef(false);
  const prevSavedRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (previewState) return;
    if (postWithdrawDrainOnce.current) return;
    postWithdrawDrainOnce.current = true;
    const snap = peekAndDrainPostWithdrawalSnapshot();
    if (snap) setWithdrawSnapshot(snap);
  }, [previewState]);

  const reloadDeposits = useCallback(() => {
    setDeposits(readJarDeposits(goalName, targetAmount));
  }, [goalName, targetAmount]);

  useEffect(() => {
    if (previewState) return;
    reloadDeposits();
  }, [previewState, reloadDeposits]);

  useEffect(() => {
    if (previewState) return;
    const onUpdate = () => reloadDeposits();
    window.addEventListener(DEPOSITS_UPDATED, onUpdate);
    return () => window.removeEventListener(DEPOSITS_UPDATED, onUpdate);
  }, [previewState, reloadDeposits]);

  const savedAmountReal = useMemo(() => savedFromDeposits(deposits), [deposits]);

  const savedAmount = useMemo(
    () =>
      previewState
        ? jarPreviewMockSavedAmount(previewState, targetAmount)
        : savedAmountReal,
    [previewState, savedAmountReal, targetAmount],
  );

  const sortedDeposits = useMemo(() => {
    if (previewState) {
      return [...jarPreviewMockDeposits(previewState, targetAmount)].sort(
        (a, b) => b.timestamp - a.timestamp,
      );
    }
    return [...deposits].sort((a, b) => b.timestamp - a.timestamp);
  }, [previewState, deposits, targetAmount]);

  useEffect(() => {
    if (previewState === "post-withdraw") {
      setHasEverReachedTarget(true);
      return;
    }
    if (previewState) return;
    if (targetAmount > 0 && savedAmountReal >= targetAmount) {
      setHasEverReachedTarget(true);
    }
  }, [previewState, savedAmountReal, targetAmount]);

  const showingPostWithdraw =
    !previewState && withdrawSnapshot !== null;
  const previouslyCompleted =
    previewState === "post-withdraw" ? true : hasEverReachedTarget;

  const derivedJarState = useMemo(
    () =>
      deriveJarState({
        savedAmount,
        targetAmount,
        previouslyCompleted,
        showingPostWithdraw,
      }),
    [savedAmount, targetAmount, previouslyCompleted, showingPostWithdraw],
  );

  const jarState: JarViewState = previewState ?? derivedJarState;

  useEffect(() => {
    if (previewState) return;
    if (continuingSuppressed) {
      prevSavedRef.current = savedAmountReal;
      return;
    }
    if (targetAmount <= 0) return;

    const prev = prevSavedRef.current;
    const next = savedAmountReal;

    if (next < targetAmount) {
      prevSavedRef.current = next;
      return;
    }

    const href = successHref(goalName, targetAmount);
    if (prev !== null && prev < targetAmount) {
      router.push(href);
    } else if (prev === null) {
      router.replace(href);
    }
    prevSavedRef.current = next;
  }, [
    previewState,
    continuingSuppressed,
    savedAmountReal,
    targetAmount,
    goalName,
    router,
  ]);

  const withdrawHref = useMemo(
    () =>
      `/withdraw?${stringifyGoalJarParams({
        goalName,
        targetAmount,
        continuing: continuingSuppressed || undefined,
        emoji: flagEmoji,
      })}`,
    [goalName, targetAmount, continuingSuppressed, flagEmoji],
  );

  const depositHref = useMemo(() => {
    const continuing = savedAmount >= targetAmount && targetAmount > 0;
    return `/deposit?${stringifyGoalJarParams({
      goalName,
      targetAmount,
      continuing: continuing || undefined,
      emoji: flagEmoji,
    })}`;
  }, [goalName, savedAmount, targetAmount, flagEmoji]);

  const progress = useMemo(() => {
    if (targetAmount <= 0) return 0;
    return Math.min(1, savedAmount / targetAmount);
  }, [savedAmount, targetAmount]);
  const remaining = remainingToGoal(targetAmount, savedAmount);
  const goalProgressComplete =
    targetAmount > 0 && savedAmount >= targetAmount;

  const formatHistoryLabel = (timestamp: number): string => {
    const elapsedMs = Date.now() - timestamp;
    const elapsedMinutes = Math.floor(elapsedMs / 60000);
    if (elapsedMinutes < 1) return "Just now";
    if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) return `${elapsedHours} hour${elapsedHours === 1 ? "" : "s"} ago`;
    const elapsedDays = Math.floor(elapsedHours / 24);
    return `${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;
  };

  useEffect(() => {
    setEarnedLive({ prev: 0, cur: 0 });
    const earningsPerSecond = (savedAmount * 0.05) / (365 * 24 * 60 * 60);
    const incrementPerTick = earningsPerSecond * 5;
    const intervalId = window.setInterval(() => {
      setEarnedLive(({ cur }) => ({
        prev: cur,
        cur: cur + incrementPerTick,
      }));
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [savedAmount]);

  useEffect(() => {
    writeJarEarnedSnapshot(earnedLive.cur);
  }, [earnedLive.cur]);

  const postWithdrawSnapshotResolved = useMemo(() => {
    if (jarState !== "post-withdraw") return null;
    if (previewState === "post-withdraw") {
      return jarPreviewMockPostWithdrawSnapshot(goalName, targetAmount);
    }
    return withdrawSnapshot;
  }, [
    jarState,
    previewState,
    goalName,
    targetAmount,
    withdrawSnapshot,
  ]);

  const completedJarsForPostWithdraw = useMemo(() => {
    if (jarState !== "post-withdraw") return [];
    if (previewState === "post-withdraw") {
      return jarPreviewMockCompletedJarsHistory(goalName, targetAmount);
    }
    return readCompletedJarsHistory();
  }, [jarState, previewState, goalName, targetAmount, withdrawSnapshot]);

  if (jarState === "post-withdraw" && postWithdrawSnapshotResolved) {
    return (
      <JarPostWithdrawScreen
        snapshot={postWithdrawSnapshotResolved}
        completedJars={completedJarsForPostWithdraw}
      />
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
      <div className="relative flex min-h-screen w-full max-w-[420px] flex-col bg-white">
        <div className="relative shrink-0">
          <div className="relative bg-[#F97316] pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/jar-top-pattern.png')" }}
              aria-hidden
            />
            <JarPeekCat motionSuppressed={leaveGoalSheetOpen} />
          </div>
        </div>

        <div className="relative z-20 flex min-h-0 flex-1 flex-col -mt-10">
          <div className="min-h-0 flex-1">
            <div className="relative rounded-t-[32px] bg-[#F5F5F5] px-5 pb-[120px] pt-14 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
              <div className="relative z-10 flex flex-col items-center pt-0">
                <JarHeader goalName={goalName} />
                <JarAmount
                  savedAmount={savedAmount}
                  remaining={remaining}
                  goalProgressComplete={goalProgressComplete}
                  formatUsdCurrency={formatUsdDisplay}
                />
                <JarVisual
                  jarState={jarState}
                  progress={progress}
                  targetAmount={targetAmount}
                />
                <JarStats
                  jarState={jarState}
                  earnedAmount={earnedLive.cur}
                  previousEarnedAmount={earnedLive.prev}
                />
                <JarHistory
                  entries={sortedDeposits}
                  formatHistoryLabel={formatHistoryLabel}
                />
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-[100] flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            aria-hidden
          >
            <span className="text-[38px] leading-none">{flagEmoji}</span>
          </div>
        </div>

        <JarActions
          depositHref={depositHref}
          breakJar={
            goalProgressComplete
              ? { mode: "link", withdrawHref }
              : {
                  mode: "confirm",
                  onPress: () => setLeaveGoalSheetOpen(true),
                }
          }
        />
        <JarLeaveGoalSheet
          open={leaveGoalSheetOpen}
          onOpenChange={setLeaveGoalSheetOpen}
          goalName={goalName}
          savedAmount={savedAmount}
          onWithdrawAnyway={() => {
            setLeaveGoalSheetOpen(false);
            router.push(withdrawHref);
          }}
        />
      </div>
    </div>
  );
}
