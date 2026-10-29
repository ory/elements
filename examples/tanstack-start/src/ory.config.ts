// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryClientConfiguration } from "@ory/elements-react"

const config = {
  project: {
    default_redirect_url: "/",
    error_ui_url: "/error",
    name: "Ory TanStack Start Example",
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    registration_ui_url: "/registration",
    verification_ui_url: "/verification",
    recovery_ui_url: "/recovery",
    login_ui_url: "/login",
    settings_ui_url: "/settings",
  },
} satisfies OryClientConfiguration

export default config
