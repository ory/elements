// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/// <reference types="vitest" />
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,vue}"],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
