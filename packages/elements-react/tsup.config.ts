// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import svgr from "esbuild-plugin-svgr"
import { defineConfig, type Options } from "tsup"

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
    dts: true,
    treeshake: true,
    external: [
      "react",
      "react-dom",
      "@ory/client-helpers",
      "@ory/client-fetch",
    ],
  },
  {
    ...baseConfig,
    entry: ["src/theme/default/index.ts"],
    outDir: "dist/theme/default",
    external: [
      "react",
      "react-dom",
      "@ory/client-helpers",
      "@ory/client-fetch",
      "@ory/elements-react",
    ],

    /* @ts-ignore -- the types of the plugin are wrong? it still works.. */
    esbuildPlugins: [svgr()],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"',
      }
    },
  },
])
