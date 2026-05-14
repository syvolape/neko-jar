/** Reusable row for deposit/withdraw history-style displays. */

import type { ReactNode } from "react";

type Props = {
  variant: "withdraw" | "deposit";
  secondaryLabel: string;
  amountNode: ReactNode;
};

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
      {children}
    </div>
  );
}

export function TransactionItem({ variant, secondaryLabel, amountNode }: Props) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex min-w-0 items-center gap-4">
        <IconCircle aria-hidden>
          {variant === "withdraw" ? (
            <svg
              className="size-[22px] text-neutral-950"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 5v12M12 5l4 4M12 5L8 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          ) : (
            <svg
              className="size-[22px] text-neutral-950"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 19V7m0 12l4-4m-4 4-4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          )}
        </IconCircle>
        <div className="min-w-0 text-left">
          <p className="font-inter text-[16px] font-medium leading-none text-black">
            {variant === "withdraw" ? "Withdraw" : "Deposit"}
          </p>
          <p className="mt-1 font-inter text-[14px] font-normal leading-none text-[#9A9A9A]">
            {secondaryLabel}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right font-outfit text-[16px] font-medium leading-none text-black">
        {amountNode}
      </div>
    </div>
  );
}
