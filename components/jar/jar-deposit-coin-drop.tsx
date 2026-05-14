"use client";

/** Jar-specific UI module: jar deposit coin drop. */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/** Coin asset for the drop animation (`public/coin new.svg`). */
const COIN_DROP_SRC = "/coin%20new.svg";

/** Display width ~1.5x prior `w-7` (28px); height follows 34:32 viewBox. */
const COIN_WIDTH_PX = 42;
const COIN_H_PX = Math.round((COIN_WIDTH_PX * 32) / 34);

/** Bottom of coin above container bottom (base clearance). */
const CLEARANCE_ABOVE_BOTTOM_PX = 25;
/** Raise resting position further so coins sit clearly inside the jar (20-30px range). */
const LANDING_LIFT_PX = 25;

/** Max horizontal offset from center (px); keeps coins inside jar opening. */
const MAX_OFFSET_X_PX = 52;

type CoinSpec = {
  id: number;
  offsetX: number;
  delayMs: number;
  durationSec: number;
  xDriftA: number;
  xDriftB: number;
  rotateFrom: number;
  rotateTo: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 1-12 coins from deposit / goal; larger relative deposits yield more coins. */
export function coinCountForDeposit(deposit: number, goal: number): number {
  if (!Number.isFinite(deposit) || deposit <= 0) return 1;
  if (!Number.isFinite(goal) || goal <= 0) return 1;
  const n = Math.round((deposit / goal) * 12);
  return clamp(n, 1, 12);
}

function buildCoins(count: number): CoinSpec[] {
  const specs: CoinSpec[] = [];

  for (let i = 0; i < count; i += 1) {
    let offsetX: number;
    if (count === 1) {
      offsetX = (Math.random() - 0.5) * 20;
    } else {
      const t = i / (count - 1);
      const base = -MAX_OFFSET_X_PX + t * (2 * MAX_OFFSET_X_PX);
      const jitter = (Math.random() - 0.5) * 22;
      offsetX = clamp(base + jitter, -MAX_OFFSET_X_PX, MAX_OFFSET_X_PX);
    }

    specs.push({
      id: i,
      offsetX,
      delayMs: 50 + Math.random() * 100,
      durationSec: 0.82 + Math.random() * 0.26,
      xDriftA: (Math.random() - 0.5) * 14,
      xDriftB: (Math.random() - 0.5) * 10,
      rotateFrom: (Math.random() - 0.5) * 12,
      rotateTo: (Math.random() - 0.5) * 8,
    });
  }

  return specs;
}

type Props = {
  depositAmount: number;
  goalAmount: number;
  onComplete: () => void;
};

/**
 * One-shot layer behind jar SVG: staggered coin rain into the jar interior.
 */
export function JarDepositCoinDrop({
  depositAmount,
  goalAmount,
  onComplete,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [landY, setLandY] = useState<number | null>(null);
  const coinCount = coinCountForDeposit(depositAmount, goalAmount);
  const coins = useMemo(() => buildCoins(coinCount), [coinCount]);

  const completeAfterMs = useMemo(() => {
    if (coins.length === 0) return 1600;
    return (
      Math.max(
        ...coins.map((c) => c.delayMs + c.durationSec * 1000),
      ) + 180
    );
  }, [coins]);

  useLayoutEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      const effectiveH = h >= 48 ? h : 280;
      const y =
        effectiveH -
        COIN_H_PX -
        CLEARANCE_ABOVE_BOTTOM_PX -
        LANDING_LIFT_PX;
      setLandY(Math.max(COIN_H_PX, y));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (landY == null) return;
    const t = window.setTimeout(() => {
      onComplete();
    }, completeAfterMs);
    return () => window.clearTimeout(t);
  }, [landY, onComplete, completeAfterMs]);

  return (
    <div
      ref={shellRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      aria-hidden
    >
      {landY != null &&
        coins.map((coin) => {
          const overshoot = Math.min(5, landY * 0.02);
          return (
            <motion.img
              key={coin.id}
              src={COIN_DROP_SRC}
              alt=""
              className="absolute top-0 h-auto -translate-x-1/2 will-change-transform"
              style={{
                left: "50%",
                width: COIN_WIDTH_PX,
                maxWidth: COIN_WIDTH_PX,
              }}
              initial={{
                x: coin.offsetX + coin.xDriftA * 0.35,
                y: -44,
                scale: 0.92,
                opacity: 1,
                rotate: coin.rotateFrom,
              }}
              animate={{
                x: [
                  coin.offsetX + coin.xDriftA,
                  coin.offsetX + coin.xDriftB,
                  coin.offsetX,
                ],
                y: [-44, landY + overshoot, landY],
                scale: [0.92, 1, 1],
                opacity: 1,
                rotate: [
                  coin.rotateFrom,
                  coin.rotateTo + 5,
                  coin.rotateTo,
                ],
              }}
              transition={{
                delay: coin.delayMs / 1000,
                duration: coin.durationSec,
                times: [0, 0.82, 1],
                ease: [
                  [0.55, 0, 1, 0.45],
                  [0.2, 0.85, 0.35, 1],
                ],
              }}
            />
          );
        })}
    </div>
  );
}
