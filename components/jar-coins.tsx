"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  progress: number;
  coinCount?: number;
};

const LEVELS = [
  { threshold: 0.01, coins: 2 },
  { threshold: 0.05, coins: 5 },
  { threshold: 0.1, coins: 8 },
  { threshold: 0.25, coins: 15 },
  { threshold: 0.5, coins: 25 },
  { threshold: 0.75, coins: 40 },
  { threshold: 1, coins: 60 },
];

const COLS = 6;
const JAR_LEFT_X = 8;
const JAR_BOTTOM_Y = 66;
const GAP_X = 14;
const GAP_Y = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getCoinCount(progress: number) {
  const normalized = Math.max(0, Math.min(1, progress));
  return LEVELS.find((l) => normalized <= l.threshold)?.coins ?? 60;
}

function getPosition(index: number) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const stagger = row % 2 === 0 ? 0 : 7;
  const offsetX = Math.sin(index * 12.9898) * 3;
  const offsetY = Math.cos(index * 78.233) * 2;

  let y = JAR_BOTTOM_Y - row * GAP_Y + offsetY;
  if (row === 0) {
    // Slight upward arc toward the middle to match jar base curvature.
    const curve = Math.pow(col - 2.5, 2) * 0.8;
    y += curve;
  }

  const x = JAR_LEFT_X + col * GAP_X + stagger + offsetX;

  return {
    x: clamp(x, 2, 78),
    y: clamp(y, 6, 80),
    row,
  };
}

export function JarCoins({ progress, coinCount }: Props) {
  const resolvedCoinCount = useMemo(
    () => clamp(coinCount ?? getCoinCount(progress), 0, 60),
    [coinCount, progress],
  );
  const prevCount = useRef(resolvedCoinCount);
  // Snapshot previous count for this render; updated after paint below.
  // eslint-disable-next-line react-hooks/refs
  const previousCount = prevCount.current;

  useEffect(() => {
    prevCount.current = resolvedCoinCount;
  }, [resolvedCoinCount]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[44px]">
      {Array.from({ length: resolvedCoinCount }, (_, index) => {
        const position = getPosition(index);
        const isNew = index >= previousCount;
        const rotate = Math.sin(index * 12.9898) * 8;
        const scale = 0.95 + Math.sin(index * 5) * 0.05;
        const skewX = Math.sin(index) * 2;
        const newCoinDelay = isNew ? (index - previousCount) * 0.05 : 0;

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            key={`jar-coin-${index}`}
            src="/coin.svg"
            alt=""
            aria-hidden
            className="absolute z-0 h-auto w-[34px] select-none"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: position.row + 1,
            }}
            initial={
              isNew
                ? {
                    y: -80,
                    opacity: 0,
                    scale: Math.max(0.8, scale - 0.07),
                    rotate: rotate - 4,
                    skewX,
                  }
                : false
            }
            animate={{
              y: 0,
              opacity: 1,
              scale: isNew ? [scale * 1.08, scale * 0.95, scale] : scale,
              rotate,
              skewX,
            }}
            transition={{
              delay: newCoinDelay,
              type: "spring",
              stiffness: 200,
              damping: 15,
              mass: 0.7,
            }}
          />
        );
      })}
    </div>
  );
}
