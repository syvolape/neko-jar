"use client";

/** Tiny one-shot confetti effect used on celebratory screens. */

import confetti from "canvas-confetti";
import { useEffect } from "react";

const Z_INDEX = 100;

/**
 * One-shot confetti on mount: instant burst, quick fall, done within ~2s.
 * No intervals; `confetti.reset()` on unmount clears the shared canvas.
 */
function ConfettiBurst() {
  useEffect(() => {
    void confetti({
      zIndex: Z_INDEX,
      particleCount: 96,
      spread: 72,
      startVelocity: 54,
      origin: { x: 0.5, y: 0.36 },
      ticks: 88,
      decay: 0.87,
      gravity: 1.28,
      scalar: 0.95,
      disableForReducedMotion: true,
    });

    return () => {
      confetti.reset();
    };
  }, []);

  return null;
}

export default ConfettiBurst;
