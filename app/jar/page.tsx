import { Suspense } from "react";

import JarScreen from "./jar-screen";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value == null || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return n;
}

export default async function JarPage(props: {
  searchParams: Promise<{
    goal?: string;
    target?: string;
    continuing?: string;
  }>;
}) {
  const sp = await props.searchParams;

  let goalName = "Trip to Japan";
  if (sp.goal) {
    try {
      goalName = decodeURIComponent(sp.goal);
    } catch {
      goalName = sp.goal;
    }
  }

  const hasTargetParam =
    sp.target !== undefined && String(sp.target).length > 0;
  const targetAmount = hasTargetParam
    ? parsePositiveInt(sp.target, 1000)
    : 1000;

  const continuingSuppressed = sp.continuing === "1";

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
          <div className="min-h-screen w-full max-w-[420px] bg-white" />
        </div>
      }
    >
      <JarScreen
        key={`${goalName}:${targetAmount}`}
        goalName={goalName}
        targetAmount={targetAmount}
        continuingSuppressed={continuingSuppressed}
      />
    </Suspense>
  );
}
