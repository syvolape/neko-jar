import DepositScreen from "./deposit-screen";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value == null || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return n;
}

export default async function DepositPage(props: {
  searchParams: Promise<{
    goal?: string;
    target?: string;
    continuing?: string;
    emoji?: string;
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

  const targetAmount = parsePositiveInt(sp.target, 1000);
  const continuingJarView = sp.continuing === "1";
  const emojiFromJar =
    typeof sp.emoji === "string" && sp.emoji.length > 0 ? sp.emoji : null;

  return (
    <DepositScreen
      goalName={goalName}
      targetAmount={targetAmount}
      continuingJarView={continuingJarView}
      emojiFromJar={emojiFromJar}
    />
  );
}
