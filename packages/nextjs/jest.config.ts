// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
export default {
  displayName: "nextjs",
  preset: "../../jest.preset.cjs",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/nextjs",
}
