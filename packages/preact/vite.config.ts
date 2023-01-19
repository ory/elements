// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import preact from "@preact/preset-vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      name: "@ory/elements-preact",
      entry: path.resolve(__dirname, "../../src/react.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      treeshake: "smallest",
      external: ["preact", "react", "react-dom"],
    },
    commonjsOptions: {
      esmExternals: ["preact", "react", "react-dom"],
    },
  },
  plugins: [vanillaExtractPlugin(), dts({ insertTypesEntry: true }), preact()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
})
