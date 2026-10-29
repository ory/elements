// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
})
