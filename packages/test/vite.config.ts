// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    target: "esnext",
    lib: {
      name: "@ory/elements-test",
      entry: path.resolve(__dirname, "../../src/tests.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
    },
    rollupOptions: {
      treeshake: "smallest",
      external: ["@playwright/test"],
    },
  },
})
