// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, type Options } from "tsup"
import vue from "unplugin-vue/esbuild"

const baseConfig: Options = {
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  format: ["cjs", "esm"],
  esbuildPlugins: [vue()],
}

export default defineConfig([
  {
    ...baseConfig,
    entry: ["src/index.ts"],
    outDir: "dist/",
    dts: false, // Vue files need vue-tsc for proper dts
    treeshake: true,
    external: ["vue", "@ory/client-fetch", "vue-i18n"],
  },
  {
    ...baseConfig,
    entry: ["src/client/index.ts"],
    outDir: "dist/client",
    dts: false, // Vue files need vue-tsc for proper dts
    external: ["vue", "@ory/client-fetch"],
  },
  {
    ...baseConfig,
    entry: ["src/theme/default/index.ts"],
    outDir: "dist/theme/default",
    dts: false, // Vue files need vue-tsc for proper dts
    external: ["vue", "@ory/client-fetch", "@ory/elements-vue", "vue-i18n"],
  },
])
