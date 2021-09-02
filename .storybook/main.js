module.exports = {
  "stories": [
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../src/stories/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"],
  postCss: false
};
