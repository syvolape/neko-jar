import CreateGoalStepClient from "./create-goal-step-client";

export default async function CreateGoalPage(props: {
  searchParams: Promise<{ goal?: string }>;
}) {
  const { goal = "" } = await props.searchParams;
  let initialGoal = "";
  try {
    initialGoal = decodeURIComponent(goal);
  } catch {
    initialGoal = goal;
  }
  return <CreateGoalStepClient initialGoal={initialGoal} />;
}
