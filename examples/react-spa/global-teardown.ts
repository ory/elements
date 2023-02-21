// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { exec } from "child_process"

const globalTeardown = async () => {
  return exec("kill $(lsof -t -i:4000) && kill $(lsof -t -i:3000)")
}

export default globalTeardown
