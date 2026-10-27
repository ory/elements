// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createOryMiddleware } from "@ory/nextjs/middleware"
import oryConfig from "@/ory.config"

// This function can be marked `async` if using `await` inside
export const middleware = createOryMiddleware({
  ...oryConfig,
  // The origins this deployment serves. For any other origin, the app and Ory
  // use the Ory project's URL.
  trustedOrigins: ["http://localhost:3000"],
})

// See "Matching Paths" below to learn more
export const config = {}
