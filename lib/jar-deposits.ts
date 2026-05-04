export type JarDeposit = {
  amount: number;
  timestamp: number;
};

type LegacyHistoryEntry = {
  id: number;
  amount: number;
  createdAt: number;
};

export function jarDepositsStorageKey(goalName: string, targetAmount: number): string {
  return `nekojar:deposits:${goalName}:${targetAmount}`;
}

function legacyHistoryKey(goalName: string, targetAmount: number): string {
  return `nekojar:history:${goalName}:${targetAmount}`;
}

function isDepositRow(x: unknown): x is JarDeposit {
  const o = x as JarDeposit | null;
  return (
    !!o &&
    typeof o.amount === "number" &&
    Number.isFinite(o.amount) &&
    typeof o.timestamp === "number"
  );
}

export function savedFromDeposits(deposits: JarDeposit[]): number {
  return deposits.reduce((sum, d) => sum + d.amount, 0);
}

/** Read deposits; if missing, one-time migrate from legacy `nekojar:history` then persist. */
export function readJarDeposits(goalName: string, targetAmount: number): JarDeposit[] {
  if (typeof window === "undefined") return [];
  const key = jarDepositsStorageKey(goalName, targetAmount);
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isDepositRow).map((d) => ({
        amount: d.amount,
        timestamp: d.timestamp,
      }));
    }
    const legacyRaw = window.localStorage.getItem(legacyHistoryKey(goalName, targetAmount));
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as unknown;
      if (Array.isArray(legacy)) {
        const migrated: JarDeposit[] = legacy
          .filter(
            (e): e is LegacyHistoryEntry =>
              !!e &&
              typeof (e as LegacyHistoryEntry).amount === "number" &&
              typeof (e as LegacyHistoryEntry).createdAt === "number",
          )
          .map((e) => ({
            amount: e.amount,
            timestamp: e.createdAt,
          }));
        if (migrated.length > 0) {
          writeJarDeposits(goalName, targetAmount, migrated);
          return migrated;
        }
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function writeJarDeposits(
  goalName: string,
  targetAmount: number,
  deposits: JarDeposit[],
): void {
  if (typeof window === "undefined") return;
  const key = jarDepositsStorageKey(goalName, targetAmount);
  window.localStorage.setItem(key, JSON.stringify(deposits));
}

/** Clears persisted deposits for one jar (e.g. after full withdrawal). */
export function clearJarDeposits(goalName: string, targetAmount: number): void {
  writeJarDeposits(goalName, targetAmount, []);
}

/** Append deposit and persist. Returns updated list (newest last). */
export function appendJarDeposit(
  goalName: string,
  targetAmount: number,
  amount: number,
): JarDeposit[] {
  const prev = readJarDeposits(goalName, targetAmount);
  const next: JarDeposit[] = [
    ...prev,
    { amount, timestamp: Date.now() },
  ];
  writeJarDeposits(goalName, targetAmount, next);
  return next;
}

export const DEPOSITS_UPDATED = "nekojar-deposits-updated";

export function notifyJarDepositsUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(DEPOSITS_UPDATED));
}

/** Stored before navigating back to `/jar`; consumed to run coin-drop animation. */
export const sessionPendingCoinDrop = "nekojar:pendingCoinDrop";
