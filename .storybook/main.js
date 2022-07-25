const { vanillaExtractPlugin } = require("@vanilla-extract/vite-plugin");
module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  typescript: {
    reactDocgen: 'react-docgen', // 👈 react-docgen configured here.
  },
  async viteFinal(config) {
    config.plugins.push(vanillaExtractPlugin());
    return config;
  },
  "features": {
    "storyStoreV7": true
  }
}
