import type { JarDeposit } from "@/lib/jar-deposits";

import { DepositIcon } from "@/components/jar/jar-inline-icons";

type Props = {
  entries: JarDeposit[];
  formatHistoryLabel: (timestamp: number) => string;
};

export function JarHistory({ entries, formatHistoryLabel }: Props) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 w-full transition-all duration-300">
      <p className="font-outfit text-[20px] font-medium leading-none text-neutral-950">
        Saving History
      </p>
      <div className="mt-5 space-y-4">
        {entries.map((entry, idx) => (
          <div
            key={`${entry.timestamp}-${idx}`}
            className="flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-full bg-white p-2">
                <DepositIcon className="size-6 text-black" />
              </div>
              <div className="space-y-1">
                <p className="font-inter text-[16px] font-medium leading-none text-black">
                  Deposit
                </p>
                <p className="font-inter text-[14px] leading-none text-[#9A9A9A]">
                  {formatHistoryLabel(entry.timestamp)}
                </p>
              </div>
            </div>
            <p className="font-outfit text-[16px] font-medium leading-none text-black">
              +{" "}
              {entry.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USDC
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
