"use client";

/** Step 2 of the create-goal flow. Resolves the goal emoji, captures the target amount, and creates the active jar session. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  CreateJarFlowBody,
  CreateJarFlowSlots,
  CreateJarStepProgress,
} from "@/components/layout/create-jar-flow-slots";
import { PrimaryCtaButton } from "@/components/ui/primary-cta-button";
import { getGoalEmojiKeywordOrDefault } from "@/lib/goal-emoji-keywords";
import { getGoalEmojiSmart } from "@/lib/get-goal-emoji-smart";
import { clearJarCoinCount } from "@/lib/jar-coin-count";
import { clearJarDeposits } from "@/lib/jar-deposits";
import {
  clearJarDraftGoal,
  readJarDraftGoal,
  readJarSession,
  writeJarSession,
} from "@/lib/jar-session";

function formatDigits(digits: string): string {
  if (!digits) return "";
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("en-US");
}

export default function CreateGoalAmountScreen() {
  const router = useRouter();
  const [goalName, setGoalName] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountDigits, setAmountDigits] = useState("");
  const [emoji, setEmoji] = useState(() =>
    getGoalEmojiKeywordOrDefault(""),
  );

  useEffect(() => {
    // The jar page is the next destination after submit, so prefetch it to keep the handoff snappy.
    router.prefetch("/jar");
  }, [router]);

  useEffect(() => {
    // This step depends on the draft created in step 1. If the draft is missing, restart the flow.
    const draftGoal = readJarDraftGoal();
    if (!draftGoal) {
      router.replace("/create-goal");
      return;
    }
    const existingSession = readJarSession();
    setGoalName(draftGoal);
    setEmoji(
      existingSession?.emoji || getGoalEmojiKeywordOrDefault(draftGoal),
    );
    setSessionReady(true);
  }, [router]);

  useEffect(() => {
    // We show a fast keyword/default emoji immediately, then upgrade it with the smarter resolver.
    if (!goalName) return;
    let cancelled = false;
    void getGoalEmojiSmart(goalName).then((next) => {
      if (!cancelled) setEmoji(next);
    });
    return () => {
      cancelled = true;
    };
  }, [goalName]);

  const displayValue = useMemo(
    () => formatDigits(amountDigits),
    [amountDigits],
  );

  const amountNumber = amountDigits ? parseInt(amountDigits, 10) : 0;
  const hasAmount = amountDigits.length > 0;
  const canSubmit =
    amountDigits.length > 0 && !Number.isNaN(amountNumber) && amountNumber > 0;

  if (!sessionReady) {
    return null;
  }

  return (
    <div className="flex min-h-screen justify-center bg-neutral-100">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col bg-white shadow-sm">
        <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <Link
            href="/create-goal"
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
          <CreateJarStepProgress activeStep={2} />
          <span aria-hidden className="block w-10" />
        </header>

        <CreateJarFlowBody
          middle={
            <CreateJarFlowSlots
              icon={
                <div className="flex size-16 shrink-0 items-center justify-center rounded-[32px] bg-[#f5f5f5] p-4 text-[32px] leading-none">
                  <span aria-hidden>{emoji}</span>
                </div>
              }
              secondaryLine={
                goalName ? (
                  <p className="m-0 max-w-full text-pretty">{goalName}</p>
                ) : (
                  <p className="m-0 text-neutral-300">Your goal</p>
                )
              }
              title={<p className="m-0">Set your goal amount</p>}
              primary={
                <div className="flex w-full justify-center gap-0">
                  <div className="inline-flex max-w-full items-baseline gap-0 font-outfit text-[2rem] font-medium leading-none tabular-nums">
                    <span className="mr-1 shrink-0 text-black" aria-hidden>
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={displayValue}
                      placeholder="1"
                      aria-label="Goal amount in dollars"
                      style={{ fieldSizing: "content", width: "auto" }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const stripped = raw.replace(/^0+(?=\d)/, "");
                        setAmountDigits(stripped);
                      }}
                      className={`w-auto min-w-0 max-w-none shrink-0 border-0 bg-transparent py-2 pl-0 text-left font-outfit text-[2rem] font-medium leading-none tabular-nums outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none ${
                        hasAmount
                          ? "text-neutral-950"
                          : "text-neutral-300 placeholder:text-neutral-300"
                      }`}
                    />
                  </div>
                </div>
              }
            />
          }
          footer={
            <PrimaryCtaButton
              type="button"
              disabled={!canSubmit || isSubmitting}
              onClick={() => {
                if (!canSubmit || isSubmitting) return;
                setIsSubmitting(true);
                const nextGoalName = goalName.trim() || "My goal";
                // Creating a jar is the moment we replace any older state for this goal/amount pair.
                clearJarDeposits(nextGoalName, amountNumber);
                clearJarCoinCount(nextGoalName, amountNumber);
                // This session becomes the single source of truth for the active jar across routes.
                writeJarSession({
                  goalName: nextGoalName,
                  targetAmount: amountNumber,
                  emoji,
                  continuingSuppressed: false,
                });
                clearJarDraftGoal();
                router.push("/jar");
              }}
            >
              Create my Jar
            </PrimaryCtaButton>
          }
        />
      </div>
    </div>
  );
}
