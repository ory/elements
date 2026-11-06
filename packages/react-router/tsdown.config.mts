// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "tsdown"

export default defineConfig({
  entry: { index: "src/index.ts", "proxy/index": "src/proxy/index.ts" },
  format: ["esm", "cjs"],
  platform: "neutral",
  target: "es2019",
  fixedExtension: false,
  sourcemap: true,
  dts: { sourcemap: false },
})
