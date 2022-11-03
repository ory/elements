// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "vite"
import preact from "@preact/preset-vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
})
