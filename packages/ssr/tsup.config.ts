// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "proxy/index": "src/proxy/index.ts",
  },
  outDir: "dist",
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  splitting: false,
  treeshake: true,
  format: ["cjs", "esm"],
})
