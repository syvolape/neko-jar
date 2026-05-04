/** Default when no keyword or AI match. */
export const DEFAULT_GOAL_EMOJI = "\u{1F3AF}";

/**
 * Ordered keyword groups: earlier entries win (e.g. tech before generic travel).
 * Match is case-insensitive substring (`includes`).
 */
export const GOAL_EMOJI_KEYWORD_MAP: ReadonlyArray<{
  readonly emoji: string;
  readonly keywords: readonly string[];
}> = [
  { emoji: "\u{1F4F1}", keywords: ["iphone", "android", "smartphone", "phone", "mobile"] },
  { emoji: "\u{1F4BB}", keywords: ["macbook", "laptop", "computer", "pc", "desktop"] },
  { emoji: "\u{231A}", keywords: ["watch", "apple watch"] },
  { emoji: "\u{1F3A7}", keywords: ["headphones", "airpods", "earbuds"] },
  { emoji: "\u{1F697}", keywords: ["car", "vehicle", "auto", "suv", "truck"] },
  { emoji: "\u{1F6B2}", keywords: ["bicycle", "cycling"] },
  { emoji: "\u{1F3CD}\u{FE0F}", keywords: ["motorcycle", "motorbike"] },
  { emoji: "\u{1F3E0}", keywords: ["house", "mortgage", "condo", "apartment", "flat"] },
  { emoji: "\u{1F3E1}", keywords: ["home", "rent", "rental", "lease"] },
  { emoji: "\u{1F393}", keywords: ["education", "university", "college", "degree", "tuition"] },
  { emoji: "\u{1F4DA}", keywords: ["course", "study", "studying", "exam", "school"] },
  { emoji: "\u{1F48D}", keywords: ["wedding", "engagement", "ring"] },
  { emoji: "\u{1F381}", keywords: ["gift", "birthday", "christmas", "present"] },
  { emoji: "\u{1F476}", keywords: ["baby", "nursery", "maternity"] },
  { emoji: "\u{1F415}", keywords: ["dog", "puppy"] },
  { emoji: "\u{1F408}", keywords: ["cat", "kitten"] },
  { emoji: "\u{2708}\u{FE0F}", keywords: ["flight", "airline", "airfare"] },
  {
    emoji: "\uD83C\uDDEF\uD83C\uDDF5",
    keywords: ["japan", "tokyo", "osaka", "kyoto", "hokkaido"],
  },
  {
    emoji: "\u{2708}\u{FE0F}",
    keywords: ["trip", "travel", "vacation", "holiday", "getaway"],
  },
  { emoji: "\u{1F3D6}\u{FE0F}", keywords: ["beach", "resort"] },
  { emoji: "\u{1F4AA}", keywords: ["gym", "fitness", "workout"] },
  { emoji: "\u{1F9B7}", keywords: ["dental", "dentist", "braces"] },
  { emoji: "\u{2695}\u{FE0F}", keywords: ["medical", "surgery", "health", "hospital"] },
  { emoji: "\u{1F3AE}", keywords: ["gaming", "console", "playstation", "xbox", "nintendo"] },
  { emoji: "\u{1F4F7}", keywords: ["camera", "photography", "lens"] },
  { emoji: "\u{1F6CB}\u{FE0F}", keywords: ["furniture", "sofa", "couch"] },
  { emoji: "\u{1F527}", keywords: ["renovation", "repair", "tools"] },
  { emoji: "\u{1F4B0}", keywords: ["emergency", "savings fund", "buffer"] },
];

/**
 * First keyword hit in priority order, or null (caller may use AI / default).
 */
export function getGoalEmojiFromKeywords(goalName: string): string | null {
  const g = goalName.trim().toLowerCase();
  if (!g) return null;

  for (const { emoji, keywords } of GOAL_EMOJI_KEYWORD_MAP) {
    for (const kw of keywords) {
      if (g.includes(kw)) return emoji;
    }
  }
  return null;
}

export function getGoalEmojiKeywordOrDefault(goalName: string): string {
  return getGoalEmojiFromKeywords(goalName) ?? DEFAULT_GOAL_EMOJI;
}
