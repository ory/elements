module.exports = {
  "stories": [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../stories/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"],
  postCss: false
};