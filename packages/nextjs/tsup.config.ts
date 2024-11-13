// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, Options } from "tsup"

const baseExternal = [
  "next",
  "@ory/client-fetch",
  "cookie",
  "set-cookie-parser",
  "tldjs",
]

const reactExternal = [...baseExternal, "react", "react-dom"]

const baseConfig: Options = {
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  format: ["cjs", "esm"],
}

export default defineConfig([
  {
    ...baseConfig,
    entry: ["src/index.ts"],
    outDir: "dist/",
    treeshake: true,
    external: [...baseExternal],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"',
      }
    },
  },
  {
    ...baseConfig,
    entry: ["src/middleware/index.ts"],
    outDir: "dist/middleware",
    treeshake: true,
    external: baseExternal,
  },
  {
    ...baseConfig,
    entry: ["src/app/index.ts"],
    outDir: "dist/app",
    treeshake: true,
    external: reactExternal,
  },
  {
    ...baseConfig,
    entry: ["src/pages/index.ts"],
    outDir: "dist/pages",
    treeshake: true,
    external: reactExternal,
  },
])
