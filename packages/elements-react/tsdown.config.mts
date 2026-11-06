// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { transform } from "@svgr/core"
import { readFile } from "node:fs/promises"
import { defineConfig, type TsdownPlugin } from "tsdown"

function svgr(): TsdownPlugin {
  return {
    name: "svgr",
    load: {
      filter: { id: /\.svg$/ },
      async handler(id) {
        const svg = await readFile(id, "utf8")
        const code = await transform(
          svg,
          {
            plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
            jsxRuntime: "automatic",
            svgProps: {
              width: "{props?.width ? props.width : props?.size ?? 20}",
              height: "{props?.height ? props.height : props?.size ?? 20}",
            },
          },
          { filePath: id },
        )
        return { code, moduleType: "jsx" }
      },
    },
  }
}

// The theme is a client-only layer, so every theme module is a client boundary.
function themeUseClient(): TsdownPlugin {
  return {
    name: "theme-use-client",
    transform: {
      filter: { id: /\/src\/theme\/.*\.(tsx?|svg)$/ },
      handler(code) {
        if (/^(\s|\/\/.*|\/\*[\s\S]*?\*\/)*["']use client["']/.test(code)) {
          return null
        }
        return { code: `"use client";${code}`, map: null }
      },
    },
  }
}

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "client/index": "src/client/index.ts",
      "theme/default/index": "src/theme/default/index.ts",
    },
    root: "src",
    unbundle: true,
    format: ["esm", "cjs"],
    platform: "neutral",
    target: "es2019",
    fixedExtension: false,
    sourcemap: true,
    dts: { sourcemap: false },
    deps: {
      neverBundle: [/^@ory\/elements-react(\/|$)/],
    },
    plugins: [svgr(), themeUseClient()],
    inputOptions: {
      // Unbundled output keeps every module's directives, so this warning does not apply.
      checks: { moduleLevelDirective: false },
    },
  },
  {
    entry: { "theme/default/index": "src/theme/default/global.css" },
    root: "src",
    clean: false,
    css: {
      transformer: "postcss",
      fileName: "theme/default/index.css",
    },
  },
])
