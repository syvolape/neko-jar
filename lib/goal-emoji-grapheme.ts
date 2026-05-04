/**
 * Best-effort first user-perceived character (grapheme), for model output that may include whitespace.
 */
export function takeFirstGrapheme(text: string): string {
  const t = text.trim();
  if (!t) return "";
  try {
    const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
    for (const { segment } of seg.segment(t)) {
      const s = segment.trim();
      if (s) return s;
    }
  } catch {
    // Intl.Segmenter unsupported (very old runtimes)
  }
  const arr = Array.from(t);
  return arr[0] ?? "";
}
