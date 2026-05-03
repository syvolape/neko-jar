"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { PrimaryCtaButton } from "@/components/primary-cta-button";

function goalEmoji(goal: string): string {
  const g = goal.toLowerCase();
  if (g.includes("japan") || g.includes("tokyo") || g.includes("osaka"))
    return "🇯🇵";
  if (g.includes("travel") || g.includes("trip")) return "✈️";
  return "🎯";
}

function formatDigits(digits: string): string {
  if (!digits) return "";
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("en-US");
}

type Props = {
  goalName: string;
};

export default function CreateGoalAmountScreen({ goalName }: Props) {
  const router = useRouter();
  const [amountDigits, setAmountDigits] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const displayValue = useMemo(
    () => formatDigits(amountDigits),
    [amountDigits],
  );

  const amountNumber = amountDigits ? parseInt(amountDigits, 10) : 0;
  const canSubmit =
    amountDigits.length > 0 && !Number.isNaN(amountNumber) && amountNumber > 0;

  const emoji = goalEmoji(goalName);

  return (
    <div className="flex min-h-screen justify-center bg-neutral-100">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col bg-white shadow-sm">
        <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <Link
            href={
              goalName
                ? `/create-goal?goal=${encodeURIComponent(goalName)}`
                : "/create-goal"
            }
            className="flex h-10 w-10 items-center justify-start text-neutral-950"
            aria-label="Back"
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
          <h1 className="text-center font-outfit text-[22px] font-medium leading-tight text-neutral-950">
            My Savings Jar
          </h1>
          <span aria-hidden className="block w-10" />
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-1 flex-col items-center justify-center gap-12 pb-8 -translate-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-16 items-center justify-center rounded-[32px] bg-[#f5f5f5] p-4 text-[32px] leading-none">
                <span aria-hidden>{emoji}</span>
              </div>
              {goalName ? (
                <p className="max-w-[280px] text-center font-outfit text-[20px] font-medium leading-tight text-neutral-950">
                  {goalName}
                </p>
              ) : (
                <p className="text-center font-outfit text-[20px] font-medium text-neutral-300">
                  Your goal
                </p>
              )}
            </div>

            <div className="flex w-full max-w-sm flex-col items-center gap-5">
              <p className="text-center font-outfit text-base font-normal text-neutral-400">
                Set your goal amount
              </p>
              <div className="flex w-full items-center justify-center gap-1.5 font-outfit text-[2rem] font-medium leading-tight">
                <span className="shrink-0 text-neutral-950">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={displayValue}
                  placeholder="1,000"
                  aria-label="Goal amount in dollars"
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const stripped = raw.replace(/^0+(?=\d)/, "");
                    setAmountDigits(stripped);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-center text-neutral-950 outline-none ring-0 placeholder:text-neutral-300 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-auto shrink-0 pt-4">
            <PrimaryCtaButton
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                if (!canSubmit) return;
                const q = new URLSearchParams({
                  goal: goalName.trim() || "My goal",
                  target: String(amountNumber),
                });
                router.push(`/jar?${q.toString()}`);
              }}
            >
              Create my Jar
            </PrimaryCtaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
