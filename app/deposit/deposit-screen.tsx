"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EarnRateInfoSheet } from "@/components/earn-rate-info-sheet";
import { InfoIcon } from "@/components/jar/jar-inline-icons";
import { appendJarCoinCount } from "@/lib/jar-coin-count";
import {
  DEPOSITS_UPDATED,
  appendJarDeposit,
  notifyJarDepositsUpdated,
  readJarDeposits,
  savedFromDeposits,
  sessionPendingCoinDrop,
  type JarDeposit,
} from "@/lib/jar-deposits";
import { readJarSession } from "@/lib/jar-session";
import {
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPressAlt,
} from "@/lib/primary-action-styles";
import { resolveJarDisplayEmoji } from "@/lib/resolve-jar-display-emoji";

function parseAmount(raw: string): number {
  if (!raw || raw === ".") return 0;
  const n = Number(raw);
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}

function formatGoalProgress(savedAmount: number, targetAmount: number): string {
  return `$ ${savedAmount.toLocaleString("en-US")} / ${targetAmount.toLocaleString("en-US")}`;
}

function formatAmountDisplay(raw: string): string {
  if (!raw || raw === ".") return "0";
  const [intPart, decPart] = raw.split(".");
  const withGrouping = (intPart || "0").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
  return decPart !== undefined ? `${withGrouping}.${decPart}` : withGrouping;
}

export default function DepositScreen() {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [emojiFromJar, setEmojiFromJar] = useState<string | null>(null);
  const [deposits, setDeposits] = useState<JarDeposit[]>([]);
  const [amountRaw, setAmountRaw] = useState("");
  const [earnRateInfoOpen, setEarnRateInfoOpen] = useState(false);

  const displayEmoji = useMemo(
    () => resolveJarDisplayEmoji(goalName, emojiFromJar),
    [goalName, emojiFromJar],
  );

  useEffect(() => {
    const session = readJarSession();
    if (!session) {
      router.replace("/create-goal");
      return;
    }
    setGoalName(session.goalName);
    setTargetAmount(session.targetAmount);
    setEmojiFromJar(session.emoji);
    setSessionReady(true);
  }, [router]);

  const reloadDeposits = useCallback(() => {
    if (!goalName || targetAmount <= 0) return;
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
  const hasTypedAmount = amountRaw.length > 0;

  const amount = useMemo(() => parseAmount(amountRaw), [amountRaw]);
  const canDeposit = amount > 0;
  const annualEarn = amount * 0.05;

  const amountText = formatAmountDisplay(amountRaw);
  const earnText = canDeposit
    ? `${annualEarn.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} USDC / year`
    : "Enter Amount";

  const appendKey = (key: string) => {
    setAmountRaw((prev) => {
      if (key === ".") {
        if (prev.includes(".")) return prev;
        return prev === "" ? "0." : `${prev}.`;
      }

      const [intPart = "", decPart] = prev.split(".");
      if (decPart !== undefined && decPart.length >= 2) return prev;
      if (!prev.includes(".") && intPart.length >= 9) return prev;

      if (prev === "0") return key;
      return `${prev}${key}`;
    });
  };

  const backspace = () => {
    setAmountRaw((prev) => prev.slice(0, -1));
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];
  const backHref = "/jar";

  const handleDeposit = () => {
    if (!canDeposit) return;
    const depositAmount = Math.round(amount * 100) / 100;
    if (!(depositAmount > 0)) return;
    try {
      sessionStorage.setItem(sessionPendingCoinDrop, String(depositAmount));
    } catch {
      // ignore quota / privacy mode
    }
    appendJarCoinCount(goalName, targetAmount, depositAmount);
    appendJarDeposit(goalName, targetAmount, depositAmount);
    notifyJarDepositsUpdated();
    router.push("/jar");
  };

  if (!sessionReady) return null;

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col bg-white">
        <header className="shrink-0 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
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
              Add Funds
            </h1>
            <span aria-hidden />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-3xl bg-[#F5F5F5] text-[24px] leading-none">
              <span aria-hidden>{displayEmoji}</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-outfit text-[20px] font-medium leading-none text-black">
                {goalName}
              </p>
              <p className="font-inter text-[16px] font-normal text-[#9A9A9A]">
                {formatGoalProgress(savedAmount, targetAmount)}
              </p>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-baseline justify-center gap-2">
              {hasTypedAmount ? (
                <span className="font-outfit text-[32px] font-medium leading-none text-black opacity-100">
                  {amountText}
                </span>
              ) : (
                <span className="font-outfit text-[32px] font-medium leading-none text-[#E9E9E9]">
                  0
                </span>
              )}
              <span className="font-outfit text-[32px] font-medium leading-none text-black">
                USDC
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F5F5F5] px-4 py-5">
            <div className="flex items-center justify-between">
              <p className="font-inter text-[14px] text-[#9A9A9A]">Earn Rate</p>
              <div className="flex items-center gap-1.5">
                <p className="font-outfit text-[18px] font-medium text-[#11AE36]">
                  5%
                </p>
                <button
                  type="button"
                  onClick={() => setEarnRateInfoOpen(true)}
                  className="flex shrink-0 rounded-full p-0.5 text-[#9A9A9A] transition hover:opacity-80 active:opacity-70"
                  aria-label="About earn rate"
                >
                  <InfoIcon className="size-5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-inter text-[14px] text-[#9A9A9A]">You Will Earn</p>
              <p
                className={`font-outfit text-[16px] font-medium ${
                  canDeposit ? "text-black" : "text-[#9A9A9A]"
                }`}
              >
                {earnText}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeposit}
            disabled={!canDeposit}
            className={[
              "mt-5 flex h-[57px] w-full items-center justify-center rounded-[20px]",
              canDeposit
                ? `${primaryActionBgShadow} ${primaryActionLabel} ${primaryActionPressAlt}`
                : "cursor-not-allowed bg-[#D6D6D6] font-outfit text-[20px] font-semibold leading-none text-white",
            ].join(" ")}
          >
            Deposit
          </button>

          <div className="mt-4 grid grid-cols-3 place-items-center gap-y-0.5 pb-1">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => appendKey(key)}
                className="flex size-16 items-center justify-center rounded-full font-outfit text-[20px] font-semibold leading-none text-[#1E1E1E] active:bg-neutral-100"
                aria-label={key === "." ? "Decimal point" : `Digit ${key}`}
              >
                {key}
              </button>
            ))}
            <button
              type="button"
              onClick={backspace}
              className="flex size-16 items-center justify-center rounded-full text-[#1E1E1E] active:bg-neutral-100"
              aria-label="Delete"
            >
              <img src="/icons/delete.svg" alt="" aria-hidden className="h-6 w-6" />
            </button>
          </div>

        </main>
        <EarnRateInfoSheet
          open={earnRateInfoOpen}
          onOpenChange={setEarnRateInfoOpen}
        />
      </div>
    </div>
  );
}
