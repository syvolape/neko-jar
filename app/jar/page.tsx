/** Route entry for the main jar experience. Suspense keeps the route lightweight while the client screen hydrates storage-backed state. */

import { Suspense } from "react";

import JarScreen from "@/components/screens/jar-screen";

export default function JarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen justify-center bg-[#F5F5F5]">
          <div className="min-h-screen w-full max-w-[420px] bg-white" />
        </div>
      }
    >
      <JarScreen />
    </Suspense>
  );
}
