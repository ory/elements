// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { viteStaticCopy } from "vite-plugin-static-copy"

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      emitCssInSsr: true,
      identifiers: ({ hash, filePath, debugId }) => {
        const name = filePath
          .split("/")
          ?.pop()
          ?.split(".")[0]
          ?.replace("-", "_")
        const id = debugId ? "_" + debugId : ""
        return `ory_elements__${name}${id}__${hash}`
      },
    }),
    dts({ insertTypesEntry: true }),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "../../src/assets",
          dest: "",
        },
      ],
    }),
  ],
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
