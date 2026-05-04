type Props = {
  goalName: string;
};

export function JarHeader({ goalName }: Props) {
  return (
    <>
      <h1 className="text-center font-outfit text-[22px] font-bold leading-tight tracking-[-0.02em] text-neutral-950">
        {goalName}
      </h1>
      <div className="mt-5 h-px w-full max-w-[80px] border-0 border-solid border-black bg-[#DBDBDB] shadow-none" />
    </>
  );
}
