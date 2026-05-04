import { NextResponse } from "next/server";

import { takeFirstGrapheme } from "@/lib/goal-emoji-grapheme";
import {
  DEFAULT_GOAL_EMOJI,
  getGoalEmojiFromKeywords,
} from "@/lib/goal-emoji-keywords";

const OPENAI_MODEL = "gpt-5-mini";

const SYSTEM_PROMPT =
  "You map user goals to a single emoji.\nReturn only one emoji. No explanation.";

/** Warm-instance cache for AI results (normalized goal ? emoji). */
const serverAiCache = new Map<string, string>();

function normalizeGoal(goalName: string): string {
  return goalName.trim().toLowerCase().slice(0, 240);
}

async function openAiSingleEmoji(goalName: string): Promise<string> {
  console.log("API KEY:", process.env.OPENAI_API_KEY);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return DEFAULT_GOAL_EMOJI;

  console.log("Calling AI for goal:", goalName);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      max_completion_tokens: 32,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: goalName.trim().slice(0, 240) },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.log("AI response:", { status: res.status, body: errBody });
    return DEFAULT_GOAL_EMOJI;
  }

  const payload: unknown = await res.json();
  console.log("AI response:", payload);
  const content = extractChatContent(payload);
  const grapheme = takeFirstGrapheme(content);
  return grapheme || DEFAULT_GOAL_EMOJI;
}

function extractChatContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return "";
  const first = choices[0];
  if (!first || typeof first !== "object") return "";
  const message = (first as { message?: unknown }).message;
  if (!message || typeof message !== "object") return "";
  const content = (message as { content?: unknown }).content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part || typeof part !== "object") return "";
        return typeof (part as { text?: unknown }).text === "string"
          ? (part as { text: string }).text
          : "";
      })
      .join("");
  }
  return "";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawGoal =
    body &&
    typeof body === "object" &&
    "goalName" in body &&
    typeof (body as { goalName: unknown }).goalName === "string"
      ? (body as { goalName: string }).goalName
      : "";

  const goalName = rawGoal.trim().slice(0, 240);
  const key = normalizeGoal(goalName);
  if (!key) {
    return NextResponse.json({ emoji: DEFAULT_GOAL_EMOJI });
  }

  const keywordHit = getGoalEmojiFromKeywords(goalName);
  if (keywordHit) {
    return NextResponse.json({ emoji: keywordHit });
  }

  const cached = serverAiCache.get(key);
  if (cached) {
    return NextResponse.json({ emoji: cached });
  }

  try {
    const emoji = await openAiSingleEmoji(goalName);
    serverAiCache.set(key, emoji);
    return NextResponse.json({ emoji });
  } catch {
    return NextResponse.json({ emoji: DEFAULT_GOAL_EMOJI });
  }
}
