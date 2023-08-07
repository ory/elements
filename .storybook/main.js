import { dirname, join } from "path";
// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const {
  vanillaExtractPlugin
} = require("@vanilla-extract/vite-plugin");
const {
  mergeConfig
} = require("vite");
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials"), getAbsolutePath("@storybook/addon-interactions")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },
  typescript: {
    reactDocgen: "react-docgen" // 👈 react-docgen configured here.
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vanillaExtractPlugin()]
    });
  },
  features: {
    storyStoreV7: true
  },
  docs: {
    autodocs: true
  }
};
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}