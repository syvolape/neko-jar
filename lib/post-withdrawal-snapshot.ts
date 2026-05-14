/** Session/local-storage handoff for the post-withdraw summary and previous-jars history. */

import type { JarDeposit } from "@/lib/jar-deposits";

export type PostWithdrawalSnapshot = {
  goalName: string;
  targetAmount: number;
  withdrawnAmount: number;
  deposits: JarDeposit[];
  withdrewAt: number;
  /** Goal icon at time of withdrawal (same mapping as jar/withdraw flows). */
  emoji?: string;
};

export const POST_WITHDRAWAL_SNAPSHOT_KEY = "nekojar:postWithdrawSnapshot";

/** Persisted list of past jars (withdrawals), newest first. Survives reloads. */
export const COMPLETED_JARS_HISTORY_KEY = "nekojar:completedJarsHistory";

const MAX_COMPLETED_JARS = 100;

function isSnapshot(x: unknown): x is PostWithdrawalSnapshot {
  const o = x as PostWithdrawalSnapshot;
  return (
    !!o &&
    typeof o.goalName === "string" &&
    typeof o.targetAmount === "number" &&
    typeof o.withdrawnAmount === "number" &&
    typeof o.withdrewAt === "number" &&
    Array.isArray(o.deposits) &&
    (o.emoji === undefined || typeof o.emoji === "string")
  );
}

/**
 * All jars the user has withdrawn from, for "Previous Jars" (and similar).
 * Newest first; capped for storage size.
 */
export function readCompletedJarsHistory(): PostWithdrawalSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_JARS_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const rows = parsed.filter(isSnapshot);
    rows.sort((a, b) => b.withdrewAt - a.withdrewAt);
    return rows;
  } catch {
    return [];
  }
}

function appendCompletedJarHistory(entry: PostWithdrawalSnapshot): void {
  if (typeof window === "undefined") return;
  const prev = readCompletedJarsHistory();
  const withoutSameEvent = prev.filter((s) => s.withdrewAt !== entry.withdrewAt);
  const next = [entry, ...withoutSameEvent].slice(0, MAX_COMPLETED_JARS);
  window.localStorage.setItem(
    COMPLETED_JARS_HISTORY_KEY,
    JSON.stringify(next),
  );
}

export function writePostWithdrawalSnapshot(data: PostWithdrawalSnapshot): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    POST_WITHDRAWAL_SNAPSHOT_KEY,
    JSON.stringify(data),
  );
  appendCompletedJarHistory(data);
}

/**
 * Read parsed snapshot without removing it (Strict Mode-safe read before guarded drain).
 */
export function peekPostWithdrawalSnapshot(): PostWithdrawalSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(POST_WITHDRAWAL_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Atomically remove and return a valid snapshot. Call once (e.g. inside a ref-guarded effect).
 */
export function peekAndDrainPostWithdrawalSnapshot(): PostWithdrawalSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(POST_WITHDRAWAL_SNAPSHOT_KEY);
    window.sessionStorage.removeItem(POST_WITHDRAWAL_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** @deprecated Prefer peekAndDrainPostWithdrawalSnapshot inside a Strict Mode-safe guard. */
export function consumePostWithdrawalSnapshot(): PostWithdrawalSnapshot | null {
  return peekAndDrainPostWithdrawalSnapshot();
}
