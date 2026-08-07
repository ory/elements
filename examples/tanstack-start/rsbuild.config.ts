// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { tanstackStart } from "@tanstack/react-start/plugin/rsbuild"

export default defineConfig({
  plugins: [pluginReact(), tanstackStart()],
  server: { port: 3000 },
})
