/** Shared primary button/link primitive used for the app's orange call-to-action actions. */

import Link from "next/link";
import type { ReactNode } from "react";

import {
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPress,
} from "@/lib/primary-action-styles";

const baseClassName = [
  "flex h-14 w-full items-center justify-center rounded-2xl px-6",
  primaryActionLabel,
  primaryActionPress,
].join(" ");

const enabledClassName = primaryActionBgShadow;

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
