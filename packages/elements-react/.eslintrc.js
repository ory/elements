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
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: __dirname + "/tsconfig.json",
  },
  rules: {
    // false positive with typescript enums, and is covered by the typescript rule
    "no-unused-vars": "off",
    // covered by typescript
    "no-undef": "off",
    // TODO(jonas): define if we want to use this rule and if we want types or interfaces
    "@typescript-eslint/consistent-type-definitions": "off",
  },
  env: {
    jest: true,
  },
}
