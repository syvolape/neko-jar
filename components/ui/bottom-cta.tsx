/** Sticky bottom call-to-action wrapper used on full-screen flows. */

import Link from "next/link";
import type { ReactNode } from "react";

import {
  primaryActionBgShadow,
  primaryActionLabel,
  primaryActionPress,
} from "@/lib/primary-action-styles";

type Props = {
  href: string;
  children: ReactNode;
};

export function BottomCTA({ href, children }: Props) {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 rounded-t-[32px] bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-none">
      <Link
        href={href}
        className={[
          "flex min-h-[57px] w-full items-center justify-center rounded-[20px] px-6",
          primaryActionBgShadow,
          primaryActionLabel,
          primaryActionPress,
        ].join(" ")}
      >
        {children}
      </Link>
    </div>
  );
}
