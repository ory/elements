// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { StorybookConfig } from "@storybook/react-vite"

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { mergeConfig } from "vite"
import vitePluginRequire from "vite-plugin-require"
import path from "path"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [nxViteTsPaths(), vitePluginRequire()],
      resolve: {
        alias: [
          {
            find: "$",
            replacement: path.resolve(__dirname, "../src/elements-react"),
          },
        ],
      },
    }),
}

export default config

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
