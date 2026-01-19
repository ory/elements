// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { StorybookConfig } from "@storybook/vue3-vite"

import path from "path"
import vue from "@vitejs/plugin-vue"
import vitePluginRequire from "vite-plugin-require"
import tailwindcss from "@tailwindcss/vite"

const config: StorybookConfig = {
  stories: ["../**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-addon-mock",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  staticDirs: ["./public"],

  viteFinal: (config) => {
    config.plugins?.unshift(vue())
    config.plugins?.push(
      tailwindcss(),
      vitePluginRequire({
        fileRegex: /\.(ts|tsx|js|jsx)$/,
      }),
    )
    config.resolve = config.resolve || {}
    config.resolve.alias = [
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
      {
        find: "$snapshots",
        replacement: path.resolve(__dirname, "../../elements-react/.stub-responses"),
      },
      {
        find: "@ory/elements-vue",
        replacement: path.resolve(__dirname, "../src"),
      },
    ]
    return config
  },
}

export default config
