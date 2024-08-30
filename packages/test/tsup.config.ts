// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "tsup"
import path from "path"

export default defineConfig({
  entry: [path.resolve(__dirname, "./src/index.ts")],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "esnext",
  treeshake: true,
  external: ["@playwright/test"],
  globalName: "Playwright",
  outDir: "dist",
  splitting: false, // Rollup's "smallest" treeshake can be interpreted by setting splitting to false
  clean: true, // Clean the output directory before each build
})
