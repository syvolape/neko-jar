"use client";

/** Informational bottom sheet that explains how the earn rate should be interpreted in the UI. */

import { useId } from "react";

import {
  BottomSheet,
  useBottomSheetRequestClose,
  useBottomSheetTitleId,
} from "@/components/ui/bottom-sheet";

/**
 * Earn rate tooltip bottom sheet (Figma node 37-1830).
 * Layout mirrors {@link JarLeaveGoalSheet}: drag handle (from BottomSheet), header row, title, body, CTA.
 *
 * @see https://www.figma.com/design/v7hxU2tNmQ8rGx3H5ConQI/NekoJar?node-id=37-1830&t=e9fMwW8guHiolZMH-1
 */
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const BODY = "text-[16px] font-normal leading-relaxed text-[#71717A]";
const SECTION_TITLE =
  "font-outfit text-[18px] font-semibold leading-tight text-neutral-950";

function EarnRateInfoSheetInner({ descriptionId }: { descriptionId: string }) {
  const titleId = useBottomSheetTitleId();
  const requestClose = useBottomSheetRequestClose();

  return (
    <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center" aria-hidden>
          <img
            src="/earn-banner/arrow-growth.svg"
            alt=""
            width={40}
            height={40}
            className="size-10 max-h-none max-w-none object-contain"
          />
        </div>
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
        Earn up to 5% per year
      </h2>

      <div id={descriptionId} className="mt-6">
        <h3 className={SECTION_TITLE}>How it works</h3>
        <p className={`mt-2 font-outfit ${BODY}`}>
          We use trusted protocols to earn rewards on your savings in the
          background. No action needed after depositing. Withdraw anytime.
        </p>

        <h3 className={`${SECTION_TITLE} mt-5`}>Risks</h3>
        <p className={`mt-2 font-outfit ${BODY}`}>
          Returns can change and are not guaranteed.
        </p>
      </div>

      <button
        type="button"
        onClick={requestClose}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#E4E4E7] font-outfit text-[20px] font-semibold leading-none text-neutral-950 transition active:scale-[0.98] active:bg-neutral-300"
      >
        Got It
      </button>
    </div>
  );
}

export function EarnRateInfoSheet({ open, onOpenChange }: Props) {
  const descriptionId = useId();

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      descriptionId={descriptionId}
    >
      <EarnRateInfoSheetInner descriptionId={descriptionId} />
    </BottomSheet>
  );
}
