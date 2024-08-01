// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getJestProjects } from "@nx/jest"

export default {
  projects: [...getJestProjects(), "<rootDir>/jest.config.ts"],
}
