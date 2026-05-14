import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/** Directory that contains `next.config.ts` and `node_modules/next` (fixes Turbopack root mis-inference). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
