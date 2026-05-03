import Link from "next/link";
import type { ReactNode } from "react";

const baseClassName =
  "flex h-14 w-full items-center justify-center rounded-2xl px-6 font-outfit text-[20px] font-medium text-white transition";

const enabledClassName =
  "bg-[#FE9302] shadow-[0_8px_24px_rgba(254,147,2,0.35)] active:scale-[0.98]";

const disabledClassName =
  "cursor-not-allowed bg-neutral-300 shadow-none";

export type PrimaryCtaButtonProps = {
  children: ReactNode;
  className?: string;
  /** When set, renders a Next.js `Link` (always enabled / primary styling). */
  href?: string;
  /** Only applies when `href` is not used. */
  disabled?: boolean;
  /** Only applies when `href` is not used. */
  type?: "button" | "submit";
  onClick?: () => void;
};

export function PrimaryCtaButton({
  children,
  className = "",
  href,
  disabled = false,
  type = "button",
  onClick,
}: PrimaryCtaButtonProps) {
  const extra = className.trim();

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClassName} ${enabledClassName} ${extra}`.trim()}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClassName} ${
        disabled ? disabledClassName : enabledClassName
      } ${extra}`.trim()}
    >
      {children}
    </button>
  );
}
