// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import svgr from "esbuild-plugin-svgr"
import postCssPlugin from "@deanc/esbuild-plugin-postcss"
import tailwindPlugin from "@tailwindcss/postcss"
import postcssScope from "postcss-scope"
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
    entry: ["src/client/**/*.{ts,tsx}", "!src/**/*.spec.{tsx,ts}"],
    outDir: "dist/client",
  },
  {
    entry: ["src/theme/default/global.prefixed.css"],
    outDir: "dist/theme/default",
    esbuildPlugins: [
      postCssPlugin({
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports
          tailwindPlugin(),
          postcssScope(".ory"),
        ],
      }),
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
