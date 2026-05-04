import { takeFirstGrapheme } from "@/lib/goal-emoji-grapheme";
import { getGoalEmojiKeywordOrDefault } from "@/lib/goal-emoji-keywords";

/**
 * Prefer a single emoji from the URL (create-jar flow), else keyword/default from goal text.
 */
export function resolveJarDisplayEmoji(
  goalName: string,
  emojiQuery: string | null,
): string {
  if (emojiQuery) {
    const trimmed = emojiQuery.trim().slice(0, 32);
    const g = takeFirstGrapheme(trimmed);
    if (g) return g;
  }
  return getGoalEmojiKeywordOrDefault(goalName);
}
