// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { type RouteConfig, index, route } from "@react-router/dev/routes"
import { oryProxyRoutes } from "@ory/react-router/proxy"

export default [
  index("routes/home.tsx"),
  route("auth/login", "routes/login.tsx"),
  route("auth/registration", "routes/registration.tsx"),
  route("auth/recovery", "routes/recovery.tsx"),
  route("auth/verification", "routes/verification.tsx"),
  route("auth/error", "routes/error.tsx"),
  route("settings", "routes/settings.tsx"),
  ...oryProxyRoutes("routes/ory-proxy.ts"),
] satisfies RouteConfig
