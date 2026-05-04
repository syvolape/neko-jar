import { redirect } from "next/navigation";

/** Legacy URL: post-withdraw UI now renders from `/jar` when a snapshot is present. */
export default function PostWithdrawalRedirectPage() {
  redirect("/jar");
}
