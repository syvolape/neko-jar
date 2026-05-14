/** Jar-specific UI module: jar actions. */

import Link from "next/link";

import {
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPress,
} from "@/lib/primary-action-styles";

const breakJarClassName =
  "flex h-14 items-center justify-center rounded-2xl bg-neutral-200 font-outfit text-[20px] font-semibold leading-none text-neutral-950 transition active:scale-[0.98] active:bg-neutral-300";

const addFundsClassName = [
  "flex h-14 items-center justify-center rounded-2xl",
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPress,
].join(" ");

type BreakJarLink = {
  mode: "link";
  withdrawHref: string;
};

type BreakJarConfirm = {
  mode: "confirm";
  onPress: () => void;
};

export type JarActionsProps = {
  depositHref: string;
  breakJar: BreakJarLink | BreakJarConfirm;
};

export function JarActions({ depositHref, breakJar }: JarActionsProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 rounded-t-[32px] bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-none">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {breakJar.mode === "link" ? (
          <Link href={breakJar.withdrawHref} className={breakJarClassName}>
            Break Jar
          </Link>
        ) : (
          <button
            type="button"
            onClick={breakJar.onPress}
            className={breakJarClassName}
          >
            Break Jar
          </button>
        )}
        <Link href={depositHref} className={addFundsClassName}>
          Add Funds
        </Link>
      </div>
    </div>
  );
}
