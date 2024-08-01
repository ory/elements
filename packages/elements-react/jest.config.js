// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/__tests__/**/*.(spec|test).[jt]s?(x)"],
}
