"use client";

import Image from "next/image";
import Link from "next/link";

import ConfettiBurst from "@/components/confetti-burst";
import { stringifyGoalJarParams } from "@/lib/goal-jar-search-params";
import { HERO_PANEL_PATH, HERO_PANEL_VIEW_BOX } from "@/lib/hero-curved-path";
import { getGoalEmojiKeywordOrDefault } from "@/lib/goal-emoji-keywords";

type Props = {
  goalName: string;
  targetAmount: number;
};

const GREEN = "#4BB45E";

const breakJarLinkClassName =
  "flex h-14 w-full items-center justify-center rounded-2xl bg-neutral-200 font-outfit text-[20px] font-semibold leading-none text-neutral-950 transition active:scale-[0.98] active:bg-neutral-300";

export default function SuccessScreen({ goalName, targetAmount }: Props) {
  const devState =
    process.env.NODE_ENV === "development" ? "&state=full" : "";
  const jarContinuingHref =
    `/jar?${stringifyGoalJarParams({
      goalName,
      targetAmount,
      continuing: true,
    })}${devState}`;

  const withdrawHref = `/withdraw?${stringifyGoalJarParams({
    goalName,
    targetAmount,
    continuing: true,
  })}`;

  const emoji = getGoalEmojiKeywordOrDefault(goalName);
  const targetDisplay = targetAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
      <div className="relative flex min-h-screen w-full max-w-[420px] flex-col overflow-hidden bg-white">
        {/* Hero: curved green band at top (~reference: top third), illustration + close */}
        <div className="relative w-full shrink-0 overflow-hidden">
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 z-0 block h-[min(42svh,360px)] w-full min-h-[260px]"
            viewBox={HERO_PANEL_VIEW_BOX}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path fill={GREEN} d={HERO_PANEL_PATH} />
          </svg>
          <ConfettiBurst />
          <div className="relative z-[110] flex min-h-[min(34svh,280px)] flex-col">
            <div className="flex justify-end px-5 pt-[max(0.5rem,env(safe-area-inset-top))]">
              <Link
                href={jarContinuingHref}
                aria-label="Close"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200/90 bg-white text-neutral-950 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </Link>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-2">
              <Image
                src="/success-goal.png"
                alt="Neko celebrating your completed goal"
                width={246}
                height={244}
                priority
                className="h-auto max-h-[min(220px,30svh)] w-auto max-w-[min(246px,85vw)] object-contain"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="mt-5 flex flex-col items-center text-center">
            <h1 className="font-outfit text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">
              {"You've reached your goal!"}
            </h1>
            <p className="mt-3 font-outfit text-[20px] font-normal leading-[1.2] text-[#9A9A9A]">
              Great job staying committed
            </p>

            <div className="mt-8 flex w-full justify-center px-2">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
                  <span className="text-[26px] leading-none" aria-hidden>
                    {emoji}
                  </span>
                </div>
                <div className="flex min-w-0 w-fit max-w-[min(100%,220px)] flex-col items-center text-center">
                  <p className="w-full truncate text-left font-outfit text-[18px] font-semibold leading-tight text-neutral-950">
                    {goalName}
                  </p>
                  <p className="mt-1 font-outfit text-[24px] font-bold leading-none text-neutral-950">
                    $ {targetDisplay}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex w-full flex-col gap-3 pt-10">
            <Link
              href={jarContinuingHref}
              className="flex h-14 w-full items-center justify-center rounded-2xl font-outfit text-[20px] font-semibold text-white transition active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Continue Saving
            </Link>
            <Link href={withdrawHref} className={breakJarLinkClassName}>
              Break Jar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
