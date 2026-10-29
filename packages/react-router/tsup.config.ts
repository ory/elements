// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, Options } from "tsup"

const baseConfig: Options = {
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  treeshake: true,
  format: ["cjs", "esm"],
  external: ["react-router", "@ory/ssr", "@ory/client-fetch"],
}

export default defineConfig([
  { ...baseConfig, entry: ["src/index.ts"], outDir: "dist/" },
  { ...baseConfig, entry: ["src/proxy/index.ts"], outDir: "dist/proxy" },
])
