import CreateGoalAmountScreen from "./create-goal-amount-screen";

export default async function CreateGoalAmountPage(props: {
  searchParams: Promise<{ goal?: string }>;
}) {
  const { goal = "" } = await props.searchParams;
  let goalName = "";
  try {
    goalName = decodeURIComponent(goal);
  } catch {
    goalName = goal;
  }
  return <CreateGoalAmountScreen goalName={goalName} />;
}
