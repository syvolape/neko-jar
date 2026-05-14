/** Jar-specific UI module: completed jar card. */

import { JarStatusBadge } from "@/components/jar/jar-status-badge";
import type { JarBadgeStatus } from "@/lib/jar-badge-status";

type Props = {
  emoji: string;
  goalName: string;
  amountDisplay: string;
  targetDisplay: string;
  badgeStatus: JarBadgeStatus;
};

export function CompletedJarCard({
  emoji,
  goalName,
  amountDisplay,
  targetDisplay,
  badgeStatus,
}: Props) {
  return (
    <div className="flex w-full items-center justify-between rounded-2xl bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[24px] bg-[#F5F5F5] p-3">
          <span className="text-[24px] leading-none">{emoji}</span>
        </div>
        <div className="flex flex-col gap-1 text-left">
          <p className="font-outfit text-[18px] font-medium leading-none text-black">
            {goalName}
          </p>
          <div className="flex items-center gap-1.5 text-[16px] leading-none">
            <span className="font-outfit font-medium text-black">{amountDisplay}</span>
            <span className="font-outfit font-normal text-[#9A9A9A]">
              / {targetDisplay}
            </span>
          </div>
        </div>
      </div>
      <JarStatusBadge status={badgeStatus} />
    </div>
  );
}
