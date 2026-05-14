"use client";

/** Jar-specific UI module: jar leave goal sheet. */

import { useId } from "react";

import {
  BottomSheet,
  useBottomSheetRequestClose,
  useBottomSheetTitleId,
} from "@/components/ui/bottom-sheet";
import { formatUsdDisplay } from "@/lib/format-usd";
import {
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPress,
} from "@/lib/primary-action-styles";

type InnerProps = {
  goalName: string;
  savedAmount: number;
  onWithdrawAnyway: () => void;
  descriptionId: string;
};

function JarLeaveGoalSheetInner({
  goalName,
  savedAmount,
  onWithdrawAnyway,
  descriptionId,
}: InnerProps) {
  const titleId = useBottomSheetTitleId();
  const requestClose = useBottomSheetRequestClose();
  const closer = formatUsdDisplay(savedAmount);

  return (
    <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mb-6 flex items-start justify-between gap-4">
        <img
          src="/broken-heart.svg"
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
          aria-hidden
        />
        <button
          type="button"
          onClick={requestClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition active:scale-95"
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2
        id={titleId}
        className="font-outfit text-[22px] font-semibold leading-tight text-neutral-950"
      >
        Leave your goal?
      </h2>

      <p
        id={descriptionId}
        className="mt-3 font-outfit text-[16px] font-normal leading-snug text-neutral-500"
      >
        You&apos;re already {closer} closer to {goalName}. Keep saving to reach it
        faster.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={requestClose}
          className={[
            "flex h-14 w-full items-center justify-center rounded-2xl",
            primaryActionBgShadow,
            primaryActionLabel,
            primaryActionPress,
          ].join(" ")}
        >
          Keep saving
        </button>
        <button
          type="button"
          onClick={onWithdrawAnyway}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-neutral-200 font-outfit text-[20px] font-semibold leading-none text-neutral-950 transition active:scale-[0.98] active:bg-neutral-300"
        >
          Withdraw anyway
        </button>
      </div>
    </div>
  );
}

export type JarLeaveGoalSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalName: string;
  savedAmount: number;
  onWithdrawAnyway: () => void;
};

export function JarLeaveGoalSheet({
  open,
  onOpenChange,
  goalName,
  savedAmount,
  onWithdrawAnyway,
}: JarLeaveGoalSheetProps) {
  const descriptionId = useId();

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      descriptionId={descriptionId}
    >
      <JarLeaveGoalSheetInner
        goalName={goalName}
        savedAmount={savedAmount}
        onWithdrawAnyway={onWithdrawAnyway}
        descriptionId={descriptionId}
      />
    </BottomSheet>
  );
}
