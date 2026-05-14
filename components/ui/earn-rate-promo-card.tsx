/** Reusable promotional card that advertises the jar's earn rate. */

type Props = {
  className?: string;
};

/**
 * Earn promo banner from Figma node 30:6641 (NekoJar).
 * @see https://www.figma.com/design/v7hxU2tNmQ8rGx3H5ConQI/NekoJar?node-id=30-6641
 */
export function EarnRatePromoCard({ className }: Props) {
  return (
    <div
      className={[
        "relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-white pl-4",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-3">
        <div className="relative flex shrink-0 items-center gap-2">
          <div className="relative size-6 shrink-0" aria-hidden>
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src="/earn-banner/arrow-growth.svg"
            />
          </div>
          <p className="shrink-0 text-center font-outfit text-[18px] font-medium leading-normal text-black">
            Earn up to 5% per year
          </p>
        </div>
        <p className="min-w-full font-inter text-[14px] font-normal leading-normal text-[#9a9a9a]">
          Your savings grow automatically over time
        </p>
      </div>

      <div className="relative size-[120px] shrink-0 overflow-clip">
        <img
          alt=""
          className="block size-full object-contain object-right"
          src="/earn-banner/banner-img.svg"
        />
      </div>
    </div>
  );
}
