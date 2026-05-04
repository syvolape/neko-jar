import SuccessScreen from "./success-screen";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value == null || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return n;
}

export default async function SuccessPage(props: {
  searchParams: Promise<{ goal?: string; target?: string }>;
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

  return (
    <SuccessScreen goalName={goalName} targetAmount={targetAmount} />
  );
}
