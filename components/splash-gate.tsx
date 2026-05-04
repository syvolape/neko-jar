"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

const LOADER_MS = 1000;
const SWIPE_MS = 300;
const OVERLAY_DONE_MS = LOADER_MS + SWIPE_MS;

const LOADER_BG = "#FFC77A";

type Phase = "loading" | "swiping" | "done";

/**
 * Home (`/`): full-screen loader on top; after 1s it swipes up (revealing the start screen underneath), ~300ms ease-out.
 */
export function SplashGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [phase, setPhase] = useState<Phase>("loading");

  useLayoutEffect(() => {
    if (pathname != null && pathname !== "/") {
      setPhase("done");
    }
  }, [pathname]);

  useEffect(() => {
    if (!isHome) return;

    const tSwipe = window.setTimeout(() => setPhase("swiping"), LOADER_MS);
    const tDone = window.setTimeout(() => setPhase("done"), OVERLAY_DONE_MS);

    return () => {
      window.clearTimeout(tSwipe);
      window.clearTimeout(tDone);
    };
  }, [isHome]);

  if (!isHome || phase === "done") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-center bg-neutral-100">
      {/* Start screen layer (under the loader; revealed when loader swipes up) */}
      <div className="relative z-0 min-h-screen w-full max-w-[420px] bg-white shadow-sm">
        {children}
      </div>

      {/* Loader covers the column, then moves up by one viewport height */}
      <div
        className="pointer-events-auto fixed left-1/2 top-0 z-10 flex min-h-screen w-full max-w-[420px] flex-col items-center justify-center px-4"
        style={{
          backgroundColor: LOADER_BG,
          transform:
            phase === "loading"
              ? "translate(-50%, 0)"
              : "translate(-50%, -100vh)",
          transition: `transform ${SWIPE_MS}ms ease-out`,
          willChange:
            phase === "loading" || phase === "swiping" ? "transform" : "auto",
        }}
        aria-hidden
      >
        <div
          className={`relative h-[min(97px,26vw)] w-[min(147px,42vw)] shrink-0 ${
            phase === "loading" ? "animate-neko-loader-pulse" : ""
          }`}
        >
          <Image
            src="/loader-logo.svg"
            alt=""
            fill
            priority
            sizes="147px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
