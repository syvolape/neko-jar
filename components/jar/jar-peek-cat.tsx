"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CAT_SRC = "/cat-play.svg";

const EASE_SHOW = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const EASE_HIDE = "cubic-bezier(0.55, 0.06, 0.68, 0.19)";

const MOVE_MS = 350;
const HOLD_MS = 1000;
const MIN_GAP_MS = 5000;
const MAX_GAP_MS = 10000;
const FIRST_GAP_MS = 2000;

function shouldSkipPeek(): boolean {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.getAttribute("contenteditable") === "true") return true;
  if (el.closest("[role='dialog']")) return true;
  if (el.closest("[data-state='open']")) return true;
  return false;
}

type Props = {
  motionSuppressed?: boolean;
};

export function JarPeekCat({ motionSuppressed = false }: Props) {
  const [peeking, setPeeking] = useState(false);
  const suppressedRef = useRef(motionSuppressed);
  const animatingRef = useRef(false);
  const gapTimerRef = useRef<number | null>(null);
  const cycleTimersRef = useRef<number[]>([]);
  const firstGapRef = useRef(true);

  useEffect(() => {
    suppressedRef.current = motionSuppressed;
  }, [motionSuppressed]);

  const clearGapTimer = useCallback(() => {
    if (gapTimerRef.current) {
      clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
  }, []);

  const clearCycleTimers = useCallback(() => {
    cycleTimersRef.current.forEach(clearTimeout);
    cycleTimersRef.current = [];
  }, []);

  const runPeekSequence = useCallback((then: () => void) => {
    if (animatingRef.current) {
      return;
    }
    if (suppressedRef.current || shouldSkipPeek()) {
      then();
      return;
    }
    animatingRef.current = true;
    clearCycleTimers();
    setPeeking(true);

    const t1 = window.setTimeout(() => {
      const t2 = window.setTimeout(() => {
        setPeeking(false);
        const t3 = window.setTimeout(() => {
          animatingRef.current = false;
          then();
        }, MOVE_MS);
        cycleTimersRef.current.push(t3);
      }, HOLD_MS);
      cycleTimersRef.current.push(t2);
    }, MOVE_MS);
    cycleTimersRef.current.push(t1);
  }, []);

  const scheduleRandomGapRef = useRef<() => void>(() => {});

  const scheduleRandomGap = useCallback(() => {
    clearGapTimer();
    const useFirst = firstGapRef.current;
    const ms = useFirst
      ? FIRST_GAP_MS
      : MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
    if (useFirst) firstGapRef.current = false;

    gapTimerRef.current = window.setTimeout(() => {
      gapTimerRef.current = null;
      runPeekSequence(() => scheduleRandomGapRef.current());
    }, ms);
  }, [clearGapTimer, runPeekSequence]);

  scheduleRandomGapRef.current = scheduleRandomGap;

  useEffect(() => {
    scheduleRandomGapRef.current();
    return () => {
      clearGapTimer();
      clearCycleTimers();
    };
    // Mount-only: avoid resetting the random timer on every parent re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInteract = useCallback(() => {
    if (animatingRef.current) return;
    if (suppressedRef.current) return;
    clearGapTimer();
    runPeekSequence(() => {
      scheduleRandomGap();
    });
  }, [clearGapTimer, runPeekSequence, scheduleRandomGap]);

  return (
    <div className="pointer-events-none absolute right-4 top-[34px] z-[5] w-[100px] select-none sm:right-5">
      {/* Hit area: covers hidden + peeking cat (pointer-events isolated here only) */}
      <div
        className="pointer-events-auto cursor-pointer pt-1"
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          handleInteract();
        }}
        onClick={handleInteract}
        aria-hidden
      >
        <div
          style={{
            transform: peeking ? "translateY(0)" : "translateY(26px)",
            transition: `transform ${MOVE_MS}ms ${
              peeking ? EASE_HIDE : EASE_SHOW
            }`,
            willChange: "transform",
          }}
        >
          <img
            src={CAT_SRC}
            alt=""
            width={103}
            height={55}
            className="block h-auto w-full max-w-[92px]"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
