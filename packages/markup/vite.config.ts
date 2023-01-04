// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import dts from "vite-plugin-dts"
import path from "path"

export default defineConfig({
  plugins: [vanillaExtractPlugin(), dts({ insertTypesEntry: true }), react()],
  build: {
    minify: "esbuild",
    lib: {
      name: "@ory/elements-markup",
      entry: path.resolve(__dirname, "../../src/markup.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      external: ["express"],
      output: {
        globals: {
          express: "express",
        },
      },
    },
  },
})
