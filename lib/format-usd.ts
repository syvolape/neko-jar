/**
 * USD for UI: clamps at $0, half-up rounding to cents, hides trailing ".00"
 * on whole dollars (e.g. $66.00 ? $66). Keeps cents when present ($66.20).
 */
export function formatUsdDisplay(value: number): string {
  const v = Math.max(0, Number.isFinite(value) ? value : 0);
  const centsAmount = Math.round(v * 100) / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(centsAmount);
  return formatted.replace(/\.00$/, "");
}

/** Remaining toward goal: goal ? saved, floored at 0, rounded to nearest cent (no truncation). */
export function remainingToGoal(goalAmount: number, savedAmount: number): number {
  const g = Number.isFinite(goalAmount) ? goalAmount : 0;
  const s = Number.isFinite(savedAmount) ? savedAmount : 0;
  const raw = g - s;
  const clamped = raw < 0 ? 0 : raw;
  return Math.round(clamped * 100) / 100;
}
