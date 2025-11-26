// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Config } from "jest"

export default {
  displayName: "@ory/elements-react",
  preset: "../../jest.preset.cjs",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: __dirname + "/tsconfig.spec.json" },
    ],
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@marsidev/react-turnstile)/)"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.js",
    "src/**/*.jsx",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/elements-react",
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/", ".svg"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest/setup.ts"],
  moduleNameMapper: {
    "^@ory\/elements-react": "<rootDir>/src/index.ts",
    "^@ory\/elements-react/client": "<rootDir>/src/client/index.ts",
  },
} satisfies Config
