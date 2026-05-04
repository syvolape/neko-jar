import type { JarDeposit } from "@/lib/jar-deposits";
import type { JarViewState } from "@/lib/jar-state";
import type { PostWithdrawalSnapshot } from "@/lib/post-withdrawal-snapshot";

const ALLOWED: ReadonlySet<JarViewState> = new Set([
  "empty",
  "progress",
  "full",
  "post-withdraw",
]);

export function parseJarPreviewState(raw: string | null): JarViewState | null {
  if (process.env.NODE_ENV !== "development" || raw == null || raw === "") {
    return null;
  }
  return ALLOWED.has(raw as JarViewState) ? (raw as JarViewState) : null;
}

/** Mock saved balance for dev URL preview (?state=...). */
export function jarPreviewMockSavedAmount(
  preview: JarViewState,
  targetAmount: number,
): number {
  switch (preview) {
    case "empty":
    case "post-withdraw":
      return 0;
    case "progress":
      return 120.5;
    case "full":
      return targetAmount > 0 ? targetAmount : 1000;
    default:
      return 0;
  }
}

/** Mock deposit rows for Saving History in dev preview. */
export function jarPreviewMockDeposits(
  preview: JarViewState,
  targetAmount: number,
): JarDeposit[] {
  const t = Date.now();
  if (preview === "empty" || preview === "post-withdraw") return [];
  if (preview === "progress") {
    return [
      { amount: 100, timestamp: t - 5 * 60 * 1000 },
      { amount: 20.5, timestamp: t - 4 * 60 * 1000 },
    ];
  }
  if (preview === "full") {
    const total = targetAmount > 0 ? targetAmount : 1000;
    const first = Math.min(400, total);
    const second = total - first;
    if (second <= 0) return [{ amount: total, timestamp: t - 60_000 }];
    return [
      { amount: first, timestamp: t - 6 * 60 * 1000 },
      { amount: second, timestamp: t - 3 * 60 * 1000 },
    ];
  }
  return [];
}

export function jarPreviewMockPostWithdrawSnapshot(
  goalName: string,
  targetAmount: number,
): PostWithdrawalSnapshot {
  const t = Date.now();
  const target = targetAmount > 0 ? targetAmount : 1000;
  return {
    goalName,
    targetAmount: target,
    withdrawnAmount: target,
    deposits: [
      { amount: 100, timestamp: t - 5 * 60 * 1000 },
      { amount: 20, timestamp: t - 4 * 60 * 1000 },
    ],
    withdrewAt: t,
  };
}

/** Dev-only: two rows in "Previous Jars" when `?state=post-withdraw`. */
export function jarPreviewMockCompletedJarsHistory(
  goalName: string,
  targetAmount: number,
): PostWithdrawalSnapshot[] {
  const t = Date.now();
  const latest = jarPreviewMockPostWithdrawSnapshot(goalName, targetAmount);
  const older: PostWithdrawalSnapshot = {
    goalName: "Earlier jar",
    targetAmount: 500,
    withdrawnAmount: 200,
    deposits: [{ amount: 200, timestamp: t - 86_400_000 }],
    withdrewAt: t - 86_400_000,
    emoji: "🐱",
  };
  return [latest, older];
}
