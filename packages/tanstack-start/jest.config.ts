// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
export default {
  displayName: "tanstack-start",
  preset: "../../jest.preset.cjs",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  transformIgnorePatterns: ["/node_modules/(?!\\.pnpm/cookie@|cookie/)"],
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js", "!src/**/*.d.ts"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/tanstack-start",
}
