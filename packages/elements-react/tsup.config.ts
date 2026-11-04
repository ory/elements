// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import svgr from "esbuild-plugin-svgr"
import path from "node:path"
import { defineConfig, type Options } from "tsup"
import { rewriteEsmRelativeImportsInDir } from "./src/client/rewrite-esm-relative-imports"

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
      "react-intl",
      "sonner",
    ],
  },
  {
    dts: true,
    minify: false,
    sourcemap: true,
    bundle: false,
    format: ["cjs", "esm"],
    entry: [
      "src/client/**/*.{ts,tsx}",
      "!src/**/*.spec.{tsx,ts}",
      "!src/client/rewrite-esm-relative-imports.ts",
    ],
    outDir: "dist/client",
    onSuccess: () => {
      rewriteEsmRelativeImportsInDir(path.resolve("dist/client"))
    },
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
      "react-intl",
      "sonner",
    ],

    esbuildPlugins: [
      svgr({
        plugins: ["@svgr/plugin-svgo"],
        svgProps: {
          width: "{props?.width ? props.width : props?.size ?? 20}",
          height: "{props?.height ? props.height : props?.size ?? 20}",
        },
      }),
    ],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"',
      }
    },
  },
])
