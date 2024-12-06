// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Config } from "jest"

export default {
  displayName: "@ory/elements-react",
  preset: "../../jest.preset.cjs",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.js",
    "src/**/*.jsx",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/elements-react",
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/", ".svg"],
} satisfies Config
