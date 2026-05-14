/** Small state machine that turns balances and flow flags into the UI mode shown on the `/jar` route. */

export type JarViewState =
  | "empty"
  | "progress"
  | "full"
  | "post-withdraw";

export type DeriveJarStateInput = {
  savedAmount: number;
  targetAmount: number;
  /** Goal reached previously (continuing flow or reached target earlier this lifecycle). */
  previouslyCompleted: boolean;
  showingPostWithdraw: boolean;
};

/**
 * Canonical jar UI mode for `/jar` (single-route state machine).
 *
 * Priority: post-withdraw (session snapshot), then balances vs target.
 * `previouslyCompleted` is part of the contract for callers (e.g. celebration / copy);
 * it does not change this phase map today.
 */
export function deriveJarState({
  savedAmount,
  targetAmount,
  previouslyCompleted,
  showingPostWithdraw,
}: DeriveJarStateInput): JarViewState {
  void previouslyCompleted;
  if (showingPostWithdraw) return "post-withdraw";

  if (savedAmount <= 0) return "empty";
  if (targetAmount > 0 && savedAmount >= targetAmount) {
    return "full";
  }
  return "progress";
}
