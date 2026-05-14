/** Marketing-style home screen that introduces the app and sends the user into the create-goal flow. */

import Image from "next/image";

import { PrimaryCtaButton } from "@/components/ui/primary-cta-button";
import { HERO_PANEL_PATH, HERO_PANEL_VIEW_BOX } from "@/lib/hero-curved-path";

export default function HomeScreen() {
  return (
    <div className="flex min-h-screen justify-center bg-neutral-100">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col bg-white shadow-sm">
        {/* Top — SVG orange shape; curve transitions to white below illustration */}
        <div className="relative min-h-[460px] w-full shrink-0 overflow-hidden px-6 pt-10 pb-14">
          <svg
            className="pointer-events-none absolute left-0 right-0 top-0 z-0 block h-[520px] w-full"
            viewBox={HERO_PANEL_VIEW_BOX}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path fill="#FE9302" d={HERO_PANEL_PATH} />
          </svg>
          <div className="relative z-10 flex w-full flex-col items-center gap-8 pb-2">
            <Image
              src="/logo.svg"
              alt="Neko Jar"
              width={73}
              height={54}
              priority
              className="h-[54px] w-[73px]"
            />
            <div className="relative w-full max-w-[280px]">
              <Image
                src="/illustration-start.svg"
                alt="Maneki-neko with savings jar"
                width={280}
                height={278}
                priority
                className="h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>
        </div>

        {/* Bottom — copy + CTA (starts below SVG curve) */}
        <section className="flex flex-1 flex-col bg-white px-6 pb-10 pt-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <h1 className="max-w-[19rem] font-outfit text-[1.75rem] font-bold leading-[1.08] tracking-tight text-neutral-950 sm:text-[1.875rem]">
              Set your goal.
              <br />
              Start saving.
              <br />
              Earn 5% a year.
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-neutral-500">
              Create a goal, track your progress and watch your savings grow.
            </p>
          </div>

          <div className="flex w-full justify-center pt-8">
            <PrimaryCtaButton href="/create-goal" className="max-w-md">
              Create My Jar
            </PrimaryCtaButton>
          </div>
        </section>
      </div>
    </div>
  );
}
