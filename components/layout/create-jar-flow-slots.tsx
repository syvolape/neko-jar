"use client";

/** Shared scaffolding for the two-step create-goal flow so both screens keep the same spacing, alignment, and footer rhythm. */

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * Shared vertical rhythm for create-goal name and create-goal amount.
 * Fixed slots (icon + secondary line) keep the primary input at the same Y when swapping steps.
 */
const GAP_ICON_BELOW = "mb-6"; // 24px: icon row -> goal name (unchanged)
/** Space goal name -> prompt + input action block (visual break; same on name + amount steps). */
const GAP_SECONDARY_TO_ACTION = "mt-10"; // 40px: goal name -> prompt + input
const GAP_TITLE_BELOW = "mb-4"; // 16px: label -> input (tight)

type SlotsProps = {
  icon: ReactNode | null;
  secondaryLine: ReactNode | null;
  title: ReactNode;
  primary: ReactNode;
};

export function CreateJarFlowSlots({
  icon,
  secondaryLine,
  title,
  primary,
}: SlotsProps) {
  return (
    <div className="mx-auto w-full max-w-sm shrink-0">
      <div
        className={`flex h-16 w-full shrink-0 justify-center ${GAP_ICON_BELOW}`}
      >
        {icon ?? <span className="block size-16 shrink-0" aria-hidden />}
      </div>

      <div className="mx-auto flex min-h-[28px] w-full max-w-[280px] items-center justify-center px-1 text-center font-outfit text-[20px] font-medium leading-tight text-neutral-950">
        {secondaryLine}
      </div>

      <div className={`w-full ${GAP_SECONDARY_TO_ACTION}`}>
        <div
          className={`w-full text-center font-outfit text-base font-normal text-neutral-400 ${GAP_TITLE_BELOW}`}
        >
          {title}
        </div>
        <div className="w-full">{primary}</div>
      </div>
    </div>
  );
}

type BodyProps = {
  middle: ReactNode;
  footer: ReactNode;
};

type StepProgressProps = {
  activeStep: 1 | 2;
};

export function CreateJarStepProgress({ activeStep }: StepProgressProps) {
  const [secondFilled, setSecondFilled] = useState(false);

  useEffect(() => {
    if (activeStep < 2) {
      setSecondFilled(false);
      return;
    }

    const id = requestAnimationFrame(() => {
      setSecondFilled(true);
    });

    return () => cancelAnimationFrame(id);
  }, [activeStep]);

  return (
    <div
      className="flex items-center justify-center gap-3"
      aria-label={`Step ${activeStep} of 2`}
      role="img"
    >
      <span
        className={`block h-1 w-16 rounded-full ${
          activeStep >= 1 ? "bg-neutral-950" : "bg-neutral-300"
        }`}
        aria-hidden
      />
      <span
        className="relative block h-1 w-16 overflow-hidden rounded-full bg-neutral-300"
        aria-hidden
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-950 transition-[width] duration-500 ease-out"
          style={{ width: activeStep >= 2 && secondFilled ? "100%" : "0%" }}
        />
      </span>
    </div>
  );
}

/**
 * Three zones below the app header: middle content (top-aligned, not vertically centered) + bottom CTA.
 * Same shell on both create-goal steps.
 */
export function CreateJarFlowBody({ middle, footer }: BodyProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="flex min-h-0 flex-1 flex-col justify-start pt-10 pb-3">
        {middle}
      </div>
      <div className="shrink-0 pt-4">{footer}</div>
    </div>
  );
}
