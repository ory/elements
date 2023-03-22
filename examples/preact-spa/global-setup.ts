// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const globlSetup = async () => {
  process.env.APPLICATION_URL =
    process.env.APPLICATION_URL || "http://localhost:3200"
  process.env.PROXY_URL = process.env.PROXY_URL || "http://localhost:4000"
  process.env.ORY_PROJECT_SLUG = process.env.ORY_PROJECT_SLUG || "playground"

  //return exec("ory tunnel ${APPLICATION_URL} ${PROXY_URL} -q")
}

export default globlSetup
