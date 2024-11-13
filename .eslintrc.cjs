// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react/jsx-runtime",
    "plugin:storybook/recommended",
    "plugin:playwright/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["src/assets/*.js"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    playwright: {
      additionalAssertFunctionNames: [],
    },
  },
  root: true,
  plugins: ["react", "@typescript-eslint", "eslint-plugin-tsdoc", "formatjs"],
  rules: {
    "tsdoc/syntax": "warn",
    "formatjs/no-offset": "error",
    "@typescript-eslint/no-floating-promises": "error",
  },
}
