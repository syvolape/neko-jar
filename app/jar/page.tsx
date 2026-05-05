import { Suspense } from "react";

import JarScreen from "./jar-screen";

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
