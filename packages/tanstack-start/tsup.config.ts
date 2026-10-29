// Copyright © 2026 Ory Corp
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
    "@ory/ssr",
    "@tanstack/react-router",
    "@tanstack/react-start",
  ],
}

export default defineConfig({
  ...baseConfig,
  entry: { index: "src/index.ts", "proxy/index": "src/proxy/index.ts" },
  outDir: "dist",
})
