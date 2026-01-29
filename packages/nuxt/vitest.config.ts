// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/// <reference types="vitest" />
import { defineConfig } from "vite"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Exclude SDK tests that require Nuxt runtime context (tested in integration)
    exclude: ["src/runtime/utils/sdk.spec.ts"],
  },
  resolve: {
    alias: {
      // Mock Nuxt's #imports for tests that might indirectly import it
      "#imports": resolve(__dirname, "src/__mocks__/imports.ts"),
    },
  },
})

// Integration test config is in vitest.integration.config.ts
