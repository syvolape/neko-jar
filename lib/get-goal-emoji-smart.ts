/** Client-side emoji resolver that tries cache, keyword matching, and finally the API before falling back to a default. */

import {
  DEFAULT_GOAL_EMOJI,
  getGoalEmojiFromKeywords,
} from "@/lib/goal-emoji-keywords";
import { takeFirstGrapheme } from "@/lib/goal-emoji-grapheme";

const LS_KEY = "neko-jar.goal-emoji-cache.v1";

const memoryCache = new Map<string, string>();

export function normalizeGoalCacheKey(goalName: string): string {
  return goalName.trim().toLowerCase();
}

function readLocalStorageRecord(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function persistToLocalStorage(key: string, emoji: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = { ...readLocalStorageRecord(), [key]: emoji };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    // quota / private mode
  }
}

function remember(key: string, emoji: string): void {
  memoryCache.set(key, emoji);
  persistToLocalStorage(key, emoji);
}

async function fetchEmojiFromApi(goalName: string): Promise<string> {
  try {
    const res = await fetch("/api/goal-emoji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalName: goalName.trim().slice(0, 240) }),
    });
    if (!res.ok) return DEFAULT_GOAL_EMOJI;
    const data: unknown = await res.json();
    if (!data || typeof data !== "object" || !("emoji" in data)) {
      return DEFAULT_GOAL_EMOJI;
    }
    const raw = (data as { emoji?: unknown }).emoji;
    if (typeof raw !== "string") return DEFAULT_GOAL_EMOJI;
    const g = takeFirstGrapheme(raw);
    return g || DEFAULT_GOAL_EMOJI;
  } catch {
    return DEFAULT_GOAL_EMOJI;
  }
}

/**
 * Cache (memory + localStorage) ? keyword match ? OpenAI (via `/api/goal-emoji`).
 * Intended for the client after navigation (e.g. amount step), not on every keystroke.
 */
export async function getGoalEmojiSmart(goalName: string): Promise<string> {
  const key = normalizeGoalCacheKey(goalName);
  if (!key) return DEFAULT_GOAL_EMOJI;

  const mem = memoryCache.get(key);
  if (mem) return mem;

  if (typeof window !== "undefined") {
    const fromDisk = readLocalStorageRecord()[key];
    if (fromDisk) {
      memoryCache.set(key, fromDisk);
      return fromDisk;
    }
  }

  const fromKeywords = getGoalEmojiFromKeywords(goalName);
  if (fromKeywords) {
    remember(key, fromKeywords);
    return fromKeywords;
  }

  if (typeof window === "undefined") {
    return DEFAULT_GOAL_EMOJI;
  }

  const resolved = await fetchEmojiFromApi(goalName);
  remember(key, resolved);
  return resolved;
}
