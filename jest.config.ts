// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getJestProjects, getJestProjectsAsync } from "@nx/jest"

export default {
  projects: await getJestProjects(),
}
