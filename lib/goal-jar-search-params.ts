/** Shared query string for `/jar`, `/withdraw`, `/deposit` goal flows. */
export function stringifyGoalJarParams(p: {
  goalName: string;
  targetAmount: number;
  continuing?: boolean;
  emoji?: string;
}): string {
  const q = new URLSearchParams();
  q.set("goal", p.goalName);
  q.set("target", String(p.targetAmount));
  if (p.continuing) q.set("continuing", "1");
  if (p.emoji) q.set("emoji", p.emoji);
  return q.toString();
}
