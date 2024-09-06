// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

export default {
  displayName: "@ory/elements-react",
  preset: "../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/elements-react",
}
