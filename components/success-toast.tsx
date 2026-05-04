"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  description: string;
  /** Auto-dismiss delay in ms */
  dismissMs?: number;
};

export function SuccessToast({ title, description, dismissMs = 3000 }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), dismissMs);
    return () => window.clearTimeout(t);
  }, [dismissMs]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-[200] w-full max-w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 px-4"
    >
      <div className="pointer-events-auto flex overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="flex shrink-0 items-center justify-center bg-white px-4 py-4">
          <img
            src="/toast-success-icon.svg"
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0"
            aria-hidden
            decoding="async"
          />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col justify-center py-3 pl-1 pr-11">
          <p className="font-outfit text-[16px] font-bold leading-tight text-neutral-950">
            {title}
          </p>
          <p className="mt-1 font-inter text-[14px] font-normal leading-snug text-[#9A9A9A]">
            {description}
          </p>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Dismiss notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
