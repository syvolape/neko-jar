"use client";

import { BottomCTA } from "@/components/bottom-cta";
import { CompletedJarCard } from "@/components/completed-jar-card";
import { EarnRatePromoCard } from "@/components/earn-rate-promo-card";
import { SuccessToast } from "@/components/success-toast";
import { getGoalEmojiKeywordOrDefault } from "@/lib/goal-emoji-keywords";
import { jarBadgeStatusAfterWithdrawal } from "@/lib/jar-badge-status";
import type { PostWithdrawalSnapshot } from "@/lib/post-withdrawal-snapshot";

function formatJarWhole(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

type Props = {
  /** Session handoff for the withdrawal just processed. */
  snapshot: PostWithdrawalSnapshot;
  /** All jars for the list (localStorage), newest first; falls back to `snapshot` if empty. */
  completedJars: PostWithdrawalSnapshot[];
};

/**
 * Post-withdrawal summary and full "Previous Jars" history.
 * Rendered inside `/jar` after break-jar (snapshot).
 */
export function JarPostWithdrawScreen({
  snapshot,
  completedJars,
}: Props) {
  const rows =
    completedJars.length > 0 ? completedJars : [snapshot];

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
      <SuccessToast
        title="Done!"
        description="Your funds are in your wallet."
      />

      <div className="relative flex min-h-screen w-full max-w-[420px] flex-col bg-white">
        <div className="relative shrink-0">
          <div className="relative bg-[#F97316] pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/jar-top-pattern.png')" }}
              aria-hidden
            />
          </div>
        </div>

        <div className="relative z-10 -mt-10 flex min-h-0 flex-1 flex-col rounded-t-[20px] bg-[#F5F5F5] shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
          {/* Soft celebratory wash (no confetti) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-t-[20px] bg-gradient-to-b from-amber-100/50 via-orange-50/30 to-transparent"
            aria-hidden
          />

          <div className="post-withdraw-enter relative flex min-h-0 flex-1 flex-col gap-8 px-5 pb-[120px] pt-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="font-outfit text-[28px] font-medium leading-tight tracking-[-0.02em] text-black">
                Start your next goal
              </h1>
              <p className="max-w-[320px] font-inter text-[16px] font-normal leading-relaxed text-[#9A9A9A]">
                You&apos;ve withdrawn from your jar.
                <br />
                Start a new one when you&apos;re ready.
              </p>
            </div>

            <EarnRatePromoCard />

            <div className="flex flex-col gap-5">
              <h2 className="font-outfit text-[20px] font-medium leading-none text-black">
                Previous Jars
              </h2>
              <div className="flex flex-col gap-3">
                {rows.map((row) => {
                  const emoji =
                    row.emoji ?? getGoalEmojiKeywordOrDefault(row.goalName);
                  const badgeStatus = jarBadgeStatusAfterWithdrawal({
                    withdrawnAmount: row.withdrawnAmount,
                    targetAmount: row.targetAmount,
                  });
                  const amountStr = `$ ${formatJarWhole(row.withdrawnAmount)}`;
                  const targetStr = formatJarWhole(row.targetAmount);
                  return (
                    <CompletedJarCard
                      key={`${row.goalName}-${row.withdrewAt}`}
                      emoji={emoji}
                      goalName={row.goalName}
                      amountDisplay={amountStr}
                      targetDisplay={targetStr}
                      badgeStatus={badgeStatus}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <BottomCTA href="/create-goal">Create New Jar</BottomCTA>
      </div>

      <style jsx global>{`
        @keyframes postWithdrawEnter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .post-withdraw-enter {
          animation: postWithdrawEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
