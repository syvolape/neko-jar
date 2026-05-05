"use client";

export type JarSession = {
  goalName: string;
  targetAmount: number;
  emoji: string;
  continuingSuppressed: boolean;
};

const JAR_SESSION_KEY = "neko-jar:session:v1";
const JAR_DRAFT_GOAL_KEY = "neko-jar:draft-goal:v1";

function isValidJarSession(value: unknown): value is JarSession {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<JarSession>;
  return (
    typeof v.goalName === "string" &&
    v.goalName.trim().length > 0 &&
    typeof v.targetAmount === "number" &&
    Number.isFinite(v.targetAmount) &&
    v.targetAmount > 0 &&
    typeof v.emoji === "string" &&
    v.emoji.length > 0 &&
    typeof v.continuingSuppressed === "boolean"
  );
}

export function readJarSession(): JarSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(JAR_SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidJarSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeJarSession(session: JarSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JAR_SESSION_KEY, JSON.stringify(session));
}

export function patchJarSession(
  patch: Partial<JarSession>,
): JarSession | null {
  const current = readJarSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  if (!isValidJarSession(next)) return null;
  writeJarSession(next);
  return next;
}

export function readJarDraftGoal(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(JAR_DRAFT_GOAL_KEY) ?? "";
}

export function writeJarDraftGoal(goalName: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JAR_DRAFT_GOAL_KEY, goalName.trim());
}

export function clearJarDraftGoal(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(JAR_DRAFT_GOAL_KEY);
}
