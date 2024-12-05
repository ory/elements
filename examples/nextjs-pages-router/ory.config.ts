// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryConfig } from "@ory/nextjs"

const config: OryConfig = {
  override: {
    applicationName: "NextJS pages router example",
    loginUiPath: "/auth/login",
    registrationUiPath: "/auth/registration",
    recoveryUiPath: "/auth/recovery",
    verificationUiPath: "/auth/verification",
  },
}

export default config
