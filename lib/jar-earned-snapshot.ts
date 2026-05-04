/**
 * Last "You Earned" live value from `/jar` (ticker), so `/withdraw` "Total Earned" can match.
 */
export const JAR_EARNED_SNAPSHOT_KEY = "nekojar:jarEarnedDisplay";

export function readJarEarnedSnapshot(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(JAR_EARNED_SNAPSHOT_KEY);
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeJarEarnedSnapshot(value: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(JAR_EARNED_SNAPSHOT_KEY, String(value));
  } catch {
    // ignore quota / privacy mode
  }
}
