// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [reactRouter()],
})
