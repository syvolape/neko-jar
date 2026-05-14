"use client";

/** Jar-specific UI module: earned amount display. */

import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

const ROLL_MS = 300;
const ROLL_EASING = "ease-out";

export function formatEarnedFourDecimals(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function splitFormatted(formatted: string): {
  intPart: string;
  decDigits: [string, string, string, string];
} {
  const dot = formatted.lastIndexOf(".");
  if (dot < 0) {
    return {
      intPart: formatted,
      decDigits: ["0", "0", "0", "0"],
    };
  }
  const intPart = formatted.slice(0, dot);
  const raw = formatted.slice(dot + 1).replace(/\D/g, "");
  const padded = `${raw}0000`.slice(0, 4);
  const chars = padded.split("");
  const d: [string, string, string, string] = [
    chars[0] ?? "0",
    chars[1] ?? "0",
    chars[2] ?? "0",
    chars[3] ?? "0",
  ];
  return { intPart, decDigits: d };
}

function intDigitsOnly(intPart: string): string[] {
  return intPart.replace(/\D/g, "").split("");
}

/** Each int-part character with digit index (for significance) or -1 for punctuation */
function intPartWithDigitIndices(
  intPart: string,
): { char: string; digitIdx: number }[] {
  let d = -1;
  return intPart.split("").map((char) => {
    if (/\d/.test(char)) {
      d += 1;
      return { char, digitIdx: d };
    }
    return { char, digitIdx: -1 };
  });
}

const digitClipClass =
  "relative inline-block h-[1em] min-h-[1em] w-[0.62em] min-w-[0.62em] shrink-0 overflow-hidden align-middle text-center tabular-nums leading-none";

type RollDigitProps = {
  digit: string;
  /** Digit shown before this update (same as `digit` when there is no roll) */
  prevDigit: string;
};

/**
 * One odometer slot: fixed-height mask, two stacked digits, translateY(-50%), then collapse to idle.
 */
const RollDigit = memo(function RollDigit({ digit, prevDigit }: RollDigitProps) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const shouldRoll =
    digit !== prevDigit && /\d/.test(digit) && /\d/.test(prevDigit);

  /** After a roll, stay on static markup until the next roll (avoids re-running while props still differ). */
  const [settled, setSettled] = useState(true);

  useLayoutEffect(() => {
    if (!shouldRoll) {
      setSettled(true);
      return;
    }
    setSettled(false);
  }, [shouldRoll, digit, prevDigit]);

  const showOdometer = shouldRoll && !settled;

  useEffect(() => {
    if (!showOdometer) return;
    const el = innerRef.current;
    if (!el) return;

    el.style.transition = "none";
    el.style.transform = "translateY(0)";
    void el.offsetHeight;
    el.style.transition = `transform ${ROLL_MS}ms ${ROLL_EASING}`;
    const id = requestAnimationFrame(() => {
      el.style.transform = "translateY(-50%)";
    });

    const fallback = window.setTimeout(() => {
      setSettled(true);
    }, ROLL_MS + 80);

    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(fallback);
    };
  }, [showOdometer, digit, prevDigit]);

  const onTrackTransitionEnd = (e: TransitionEvent<HTMLSpanElement>) => {
    if (e.propertyName !== "transform") return;
    if (e.target !== innerRef.current) return;
    const el = innerRef.current;
    if (el) {
      el.style.transition = "none";
      el.style.transform = "translateY(0)";
      el.style.willChange = "auto";
    }
    setSettled(true);
  };

  if (!showOdometer) {
    return (
      <span className={digitClipClass}>
        <span className="flex h-full w-full items-center justify-center">
          {digit}
        </span>
      </span>
    );
  }

  return (
    <span className={digitClipClass}>
      <span
        ref={innerRef}
        className="flex w-full flex-col ease-out"
        style={{
          height: "2em",
          willChange: "transform",
        }}
        onTransitionEnd={onTrackTransitionEnd}
      >
        <span
          className="box-border flex w-full flex-none items-center justify-center leading-none"
          style={{ height: "1em", flex: "0 0 1em" }}
        >
          {prevDigit}
        </span>
        <span
          className="box-border flex w-full flex-none items-center justify-center leading-none"
          style={{ height: "1em", flex: "0 0 1em" }}
        >
          {digit}
        </span>
      </span>
    </span>
  );
});

RollDigit.displayName = "RollDigit";

type EarnedAmountDisplayProps = {
  earnedAmount: number;
  previousEarnedAmount: number;
};

/**
 * "You Earned" number: 4 decimal places, per-digit odometer only where digits change.
 */
export function EarnedAmountDisplay({
  earnedAmount,
  previousEarnedAmount,
}: EarnedAmountDisplayProps) {
  const formatted = useMemo(
    () => formatEarnedFourDecimals(earnedAmount),
    [earnedAmount],
  );
  const prevFormatted = useMemo(
    () => formatEarnedFourDecimals(previousEarnedAmount),
    [previousEarnedAmount],
  );

  const { intPart, decDigits } = useMemo(
    () => splitFormatted(formatted),
    [formatted],
  );
  const prevSplit = useMemo(
    () => splitFormatted(prevFormatted),
    [prevFormatted],
  );

  const currIntDigits = intDigitsOnly(intPart);
  const prevIntDigits = intDigitsOnly(prevSplit.intPart);

  const intNodes = intPartWithDigitIndices(intPart).map(({ char: c, digitIdx }, i) => {
    if (digitIdx < 0) {
      return (
        <span
          key={`p-${i}`}
          className="inline-block min-w-[0.24em] shrink-0 text-center align-middle leading-none"
          aria-hidden
        >
          {c}
        </span>
      );
    }
    const sigFromRight = currIntDigits.length - 1 - digitIdx;
    const prevD =
      sigFromRight < prevIntDigits.length
        ? prevIntDigits[prevIntDigits.length - 1 - sigFromRight]
        : null;
    const roll =
      prevD !== null &&
      prevD !== c &&
      /\d/.test(prevD) &&
      /\d/.test(c);

    return (
      <RollDigit key={`d-${i}`} digit={c} prevDigit={roll ? prevD : c} />
    );
  });

  const decNodes = decDigits.map((c, i) => {
    const p = prevSplit.decDigits[i];
    const roll = p !== c;
    return <RollDigit key={`dec-${i}`} digit={c} prevDigit={roll ? p : c} />;
  });

  return (
    <span
      aria-hidden
      className="inline-flex min-w-0 items-baseline font-outfit text-[18px] font-medium leading-none text-[#11AE36] tabular-nums"
    >
      {intNodes}
      <span
        className="inline-block w-[0.35em] shrink-0 text-center align-middle leading-none"
        aria-hidden
      >
        .
      </span>
      {decNodes}
    </span>
  );
}
