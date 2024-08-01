// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "../../.eslintrc.cjs",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: __dirname + "/tsconfig.json",
  },
  rules: {
    // false positive with typescript
    "no-unused-vars": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    // Add your custom rules here
  },
  env: {
    jest: true,
  },
}
