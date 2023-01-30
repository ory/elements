// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const { vanillaExtractPlugin } = require("@vanilla-extract/vite-plugin")
const { resolve } = require("path")
const { mergeConfig } = require("vite")

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  typescript: {
    reactDocgen: "react-docgen", // 👈 react-docgen configured here.
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
    })
  },
  features: {
    storyStoreV7: true,
  },
}
