"use client";

import Image from "next/image";

function goalEmoji(goal: string): string {
  const g = goal.toLowerCase();
  if (g.includes("japan") || g.includes("tokyo") || g.includes("osaka"))
    return "\uD83C\uDDEF\uD83C\uDDF5";
  if (g.includes("travel") || g.includes("trip")) return "\u2708\uFE0F";
  return "\uD83C\uDFAF";
}

function formatUsdPlain(n: number): string {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

function formatUsdCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Subtle hiragana repeat on orange (Figma-style texture). */
function OrangeKanjiPattern() {
  const hiA = String.fromCharCode(0x3042);
  const hiI = String.fromCharCode(0x3044);
  const nihon = String.fromCharCode(0x306b, 0x307b, 0x3093);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <pattern
          id="neko-jar-texture"
          x="0"
          y="0"
          width="88"
          height="88"
          patternUnits="userSpaceOnUse"
        >
          <text
            x="6"
            y="28"
            fill="#C55F00"
            opacity="0.22"
            style={{ fontFamily: "system-ui, sans-serif", fontSize: 15 }}
          >
            {hiA}
          </text>
          <text
            x="44"
            y="52"
            fill="#C55F00"
            opacity="0.18"
            style={{ fontFamily: "system-ui, sans-serif", fontSize: 13 }}
          >
            {hiI}
          </text>
          <text
            x="22"
            y="72"
            fill="#C55F00"
            opacity="0.2"
            style={{ fontFamily: "system-ui, sans-serif", fontSize: 14 }}
          >
            {nihon}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#neko-jar-texture)" />
    </svg>
  );
}

/** Glass jar illustration (asset: /public/jar.svg). */
function JarIllustration() {
  return (
    <Image
      src="/jar.svg"
      alt=""
      width={280}
      height={280}
      className="mx-auto h-[min(280px,42vw)] w-auto max-w-[280px]"
      aria-hidden
    />
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 16l4-4 4 4 8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8h4v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  goalName: string;
  targetAmount: number;
  savedAmount: number;
};

export default function JarScreen({
  goalName,
  targetAmount,
  savedAmount,
}: Props) {
  const flagEmoji = goalEmoji(goalName);

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col bg-white">
        {/* Orange header + pattern */}
        <div className="relative shrink-0 bg-[#FE9302] pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <OrangeKanjiPattern />
        </div>

        {/* White sheet overlaps orange */}
        <div className="relative z-20 -mt-10 flex flex-1 flex-col pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="relative rounded-t-[20px] bg-white px-5 pb-10 pt-16 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
            {/* Flag badge overlaps top edge */}
            <div
              className="absolute left-1/2 top-0 flex size-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              aria-hidden
            >
              <span className="text-[28px] leading-none">{flagEmoji}</span>
            </div>

            <div className="flex flex-col items-center pt-2">
              <h1 className="text-center font-outfit text-[22px] font-bold leading-tight tracking-[-0.02em] text-neutral-950">
                {goalName}
              </h1>
              <div className="mt-5 h-px w-full max-w-[280px] bg-neutral-200" />

              <p className="mt-8 font-outfit text-[40px] font-bold leading-[44px] tracking-[-0.03em] text-neutral-950">
                $ {formatUsdPlain(savedAmount)}
              </p>
              <p className="mt-2 text-center font-outfit text-[15px] font-normal leading-5 text-neutral-400">
                {formatUsdCurrency(targetAmount)} to reach your goal
              </p>

              <div className="mt-10 flex w-full justify-center">
                <JarIllustration />
              </div>

              {/* Earn card */}
              <div className="mt-10 flex w-full items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="flex shrink-0 items-start pt-0.5">
                  <TrendUpIcon className="text-[#22C55E]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-outfit text-[16px] font-bold leading-snug text-neutral-950">
                    Earn up to 5% per year
                  </p>
                  <p className="mt-1 font-outfit text-[13px] font-normal leading-relaxed text-neutral-400">
                    Your savings grow automatically over time
                  </p>
                </div>
                <Image
                  src="/earn-card-banner.svg"
                  alt=""
                  width={120}
                  height={120}
                  className="size-[120px] shrink-0"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-8 grid grid-cols-2 gap-3 px-1">
            <button
              type="button"
              className="flex h-14 items-center justify-center rounded-2xl bg-neutral-200 font-outfit text-[17px] font-semibold text-neutral-950 transition active:scale-[0.98] active:bg-neutral-300"
            >
              Break Jar
            </button>
            <button
              type="button"
              className="flex h-14 items-center justify-center rounded-2xl bg-[#FE9302] font-outfit text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(254,147,2,0.35)] transition active:scale-[0.98]"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
