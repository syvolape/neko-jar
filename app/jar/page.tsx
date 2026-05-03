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
    saved?: string;
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

  let savedAmount: number;
  if (sp.saved !== undefined && String(sp.saved).length > 0) {
    savedAmount = parsePositiveInt(sp.saved, 0);
  } else if (hasTargetParam) {
    savedAmount = 0;
  } else {
    savedAmount = Math.min(320, targetAmount);
  }
  savedAmount = Math.min(savedAmount, targetAmount);

  return (
    <JarScreen
      goalName={goalName}
      targetAmount={targetAmount}
      savedAmount={savedAmount}
    />
  );
}
