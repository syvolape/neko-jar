"use client";

/** Step 1 of the create-goal flow. Collects the goal name and stores it as draft state before navigating to the amount step. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CreateJarFlowBody,
  CreateJarFlowSlots,
  CreateJarStepProgress,
} from "@/components/layout/create-jar-flow-slots";
import { PrimaryCtaButton } from "@/components/ui/primary-cta-button";
import { writeJarDraftGoal } from "@/lib/jar-session";

export default function CreateGoalScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState("");

  // The primary CTA only unlocks once the user has entered something meaningful.
  const canContinue = goal.trim().length > 0;

  return (
    <div className="flex min-h-screen justify-center bg-neutral-100">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col bg-white shadow-sm">
        <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <Link
            href="/"
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
          <CreateJarStepProgress activeStep={1} />
          <span aria-hidden className="block w-10" />
        </header>

        <CreateJarFlowBody
          middle={
            <CreateJarFlowSlots
              icon={null}
              secondaryLine={null}
              title={<p className="m-0">What are you saving for?</p>}
              primary={
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Trip to Japan"
                  enterKeyHint="done"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full border-0 bg-transparent px-2 py-2 text-center font-outfit text-[2rem] font-medium leading-none text-neutral-950 outline-none ring-0 placeholder:text-neutral-300 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
                />
              }
            />
          }
          footer={
            <PrimaryCtaButton
              type="button"
              disabled={!canContinue}
              onClick={() => {
                // Step 1 only saves a lightweight draft; the real jar is created on step 2.
                writeJarDraftGoal(goal);
                router.push("/create-goal/amount");
              }}
            >
              Continue
            </PrimaryCtaButton>
          }
        />
      </div>
    </div>
  );
}
