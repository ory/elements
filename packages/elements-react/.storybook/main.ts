// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { StorybookConfig } from "@storybook/react-vite"

import path from "path"
import { mergeConfig } from "vite"
import vitePluginRequire from "vite-plugin-require"
import svgr from "vite-plugin-svgr"

const config: StorybookConfig = {
  stories: ["../**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["./public"],

  viteFinal: (config) => {
    console.log(path.resolve(__dirname, "../src"))
    return mergeConfig(config, {
      plugins: [vitePluginRequire(), svgr({ include: "**/*.svg" })],
      build: {
        rollupOptions: {
          onwarn(warning, warn) {
            // Suppress "Module level directives cause errors when bundled" warnings
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
              return
            }
            warn(warning)
          },
        },
      },
      resolve: {
        alias: [
          {
            find: "$snapshots",
            replacement: path.resolve(__dirname, "../.stub-responses"),
          },
          {
            find: "@ory/elements-react",
            replacement: path.resolve(__dirname, "../src"),
          },
        ],
      },
    })
  },
}

export default config
