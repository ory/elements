// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createOryProxyHandler } from "@ory/react-router/proxy"
import config from "../ory.config"

const proxy = createOryProxyHandler({
  ...config,
  trustedOrigins: ["http://localhost:5173"],
})

export const loader = proxy
export const action = proxy
