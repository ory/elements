// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "tsdown"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "middleware/index": "src/middleware/index.ts",
    "app/index": "src/app/index.ts",
    "pages/index": "src/pages/index.ts",
  },
  format: ["esm", "cjs"],
  platform: "neutral",
  target: "es2019",
  fixedExtension: false,
  sourcemap: true,
  dts: { sourcemap: false },
})
