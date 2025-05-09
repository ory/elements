// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { StorybookConfig } from "@storybook/react-vite"

import path from "path"
import { mergeConfig } from "vite"
import vitePluginRequire from "vite-plugin-require"
import svgr from "vite-plugin-svgr"

const config: StorybookConfig = {
  stories: ["../**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-addon-mock",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["./public"],

  viteFinal: (config) => {
    return mergeConfig(config, {
      plugins: [
        vitePluginRequire(),
        svgr({
          include: "**/*.svg",
          svgrOptions: {
            svgProps: {
              width: "{props?.width ? props.width : props?.size ?? 20}",
              height: "{props?.height ? props.height : props?.size ?? 20}",
            },
          },
        }),
      ],
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
