/** Jar-specific UI module: jar status badge. */

import type { JarBadgeStatus } from "@/lib/jar-badge-status";

type Props = {
  status: JarBadgeStatus;
};

/**
 * Single source of truth for jar row / header status copy and styling.
 */
export function JarStatusBadge({ status }: Props) {
  if (status === "withdrawn") return null;

  if (status === "active") {
    return (
      <div className="shrink-0 font-outfit text-[13px] font-medium text-neutral-400">
        In progress
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-[#11AE36] px-2 py-1">
      <svg
        className="size-4 text-white"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-outfit text-[14px] font-normal leading-none text-white">
        Completed
      </span>
    </div>
  );
}
