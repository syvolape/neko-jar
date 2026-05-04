/**
 * Jar status for status badges (list rows, withdraw header, etc.).
 *
 * - active: still saving, goal not reached -> show "In progress"
 * - completed: goal reached (including before withdrawal) -> show "Completed"
 * - withdrawn: user withdrew before reaching goal -> no badge
 */
export type JarBadgeStatus = "active" | "completed" | "withdrawn";

/** Jar still open on `/jar` or `/withdraw` (not yet withdrawn). */
export function jarBadgeStatusForActiveJar(input: {
  savedAmount: number;
  targetAmount: number;
}): "active" | "completed" {
  const { savedAmount, targetAmount } = input;
  if (targetAmount > 0 && savedAmount >= targetAmount && savedAmount > 0) {
    return "completed";
  }
  return "active";
}

/** Historical jar after a withdrawal (snapshot or persisted row). */
export function jarBadgeStatusAfterWithdrawal(input: {
  withdrawnAmount: number;
  targetAmount: number;
}): "completed" | "withdrawn" {
  const { withdrawnAmount, targetAmount } = input;
  if (targetAmount > 0 && withdrawnAmount >= targetAmount) {
    return "completed";
  }
  return "withdrawn";
}
