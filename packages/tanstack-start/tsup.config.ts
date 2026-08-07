// SPDX-License-Identifier: Apache-2.0

import { defineConfig, Options } from "tsup"

const baseConfig: Options = {
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  format: ["esm"],
  treeshake: true,
  external: [
    "@ory/client-fetch",
    "@tanstack/react-router",
    "@tanstack/react-start",
    "cookie",
    "psl",
    "set-cookie-parser",
  ],
}

export default defineConfig([
  { ...baseConfig, entry: ["src/index.ts"], outDir: "dist/" },
  { ...baseConfig, entry: ["src/server/index.ts"], outDir: "dist/server" },
  {
    ...baseConfig,
    entry: ["src/middleware/index.ts"],
    outDir: "dist/middleware",
  },
])
