// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { oryProxyMiddleware } from "@ory/tanstack-start/proxy"
import { createCsrfMiddleware, createStart } from "@tanstack/react-start"
import config from "./ory.config"

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
})

const oryProxy = oryProxyMiddleware({
  ...config,
  trustedOrigins: ["http://localhost:3000"],
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, oryProxy],
}))
