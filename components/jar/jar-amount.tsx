/** Jar-specific UI module: jar amount. */

type Props = {
  savedAmount: number;
  remaining: number;
  goalProgressComplete: boolean;
  formatUsdCurrency: (n: number) => string;
};

export function JarAmount({
  savedAmount,
  remaining,
  goalProgressComplete,
  formatUsdCurrency,
}: Props) {
  return (
    <>
      <p className="mt-8 font-outfit text-[40px] font-bold leading-[44px] tracking-[-0.03em] text-neutral-950">
        {formatUsdCurrency(savedAmount)}
      </p>
      <p className="mt-2 text-center font-outfit text-[15px] font-normal leading-5 text-neutral-400">
        {goalProgressComplete
          ? "You've reached your savings goal!"
          : `${formatUsdCurrency(remaining)} to reach your goal`}
      </p>
    </>
  );
}
