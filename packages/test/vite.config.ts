// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      root: path.resolve(__dirname, "../../src/test"),
      insertTypesEntry: true,
      tsConfigFilePath: path.resolve(__dirname, "tsconfig.json"),
      outputDir: path.resolve(__dirname, "dist"),
      exclude: [
        "node_modules",
        "dist",
        "**/*.spec.ts",
        path.resolve(__dirname, "../../node_modules"),
      ],
    }),
  ],
  build: {
    target: "esnext",
    sourcemap: true,
    lib: {
      name: "@ory/elements-test",
      entry: path.resolve(__dirname, "../../src/tests.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      treeshake: "smallest",
      external: ["@playwright/test", "msw", "msw/node"],
      output: {
        globals: {
          "@playwright/test": "Playwright",
          "msw/node": "msw/node",
          msw: "msw",
        },
      },
    },
  },
})
