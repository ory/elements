// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryConfig } from "@ory/nextjs"

const config: OryConfig = {
  override: {
    applicationName: "Ory Next.js App Router Example",
    loginUiPath: "/auth/login",
    registrationUiPath: "/auth/registration",
    recoveryUiPath: "/auth/recovery",
    verificationUiPath: "/auth/verification",
    settingsUiPath: "/settings",
    defaultRedirectUri: "/",
  },
}

export default config
