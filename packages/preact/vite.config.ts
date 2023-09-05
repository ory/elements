// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import preact from "@preact/preset-vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { viteStaticCopy } from "vite-plugin-static-copy"

export default defineConfig({
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  build: {
    target: "esnext",
    lib: {
      name: "@ory/elements",
      entry: path.resolve(__dirname, "../../src/react.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      treeshake: "smallest",
      external: ["preact", "react", "react-dom"],
    },
    commonjsOptions: {
      esmExternals: ["preact"],
    },
  },
  plugins: [
    vanillaExtractPlugin(),
    dts({ insertTypesEntry: true }),
    preact(),
    viteStaticCopy({
      targets: [
        {
          src: "../../src/assets",
          dest: "",
        },
      ],
    }),
  ],
})
