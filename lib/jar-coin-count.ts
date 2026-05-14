/** Persists how many decorative coins the jar should render for the current goal. */

const MAX_JAR_COINS = 60;

function jarCoinCountKey(goalName: string, targetAmount: number): string {
  // Goal name + target amount makes the decorative coin count stable per jar.
  return `nekojar:coincount:${goalName}:${targetAmount}`;
}

function clampCoinCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_JAR_COINS, Math.round(value)));
}

export function readJarCoinCount(goalName: string, targetAmount: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(jarCoinCountKey(goalName, targetAmount));
    if (!raw) return 0;
    return clampCoinCount(Number(raw));
  } catch {
    return 0;
  }
}

export function writeJarCoinCount(
  goalName: string,
  targetAmount: number,
  coinCount: number,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    jarCoinCountKey(goalName, targetAmount),
    String(clampCoinCount(coinCount)),
  );
}

export function clearJarCoinCount(goalName: string, targetAmount: number): void {
  writeJarCoinCount(goalName, targetAmount, 0);
}

export function coinIncrementForDeposit(amount: number, targetAmount: number): number {
  if (!(amount > 0)) return 0;
  // Bigger deposits add more coins, but every valid deposit adds at least one so the jar always reacts.
  const denom = Math.max(1, targetAmount);
  const proportional = Math.round((amount / denom) * MAX_JAR_COINS);
  return Math.max(1, proportional);
}

export function appendJarCoinCount(
  goalName: string,
  targetAmount: number,
  depositAmount: number,
): number {
  const current = readJarCoinCount(goalName, targetAmount);
  const increment = coinIncrementForDeposit(depositAmount, targetAmount);
  const next = clampCoinCount(current + increment);
  writeJarCoinCount(goalName, targetAmount, next);
  return next;
}
