// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getJestProjectsAsync } from "@nx/jest"

export default async () => ({
  projects: [...(await getJestProjectsAsync())],
})
