// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
