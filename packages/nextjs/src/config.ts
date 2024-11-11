// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryConfig } from "./types"
import { OryClientConfiguration } from "@ory/elements-react"
import { getSdkUrl } from "./sdk"

export function useOryConfig(
  config: Partial<OryConfig>,
): OryClientConfiguration {
  // TODO load this info from the server

  return {
    name: config.override?.applicationName ?? "Default name",
    sdk: {
      url: getSdkUrl(),
    },
    project: {
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
      recovery_ui_url: config.override?.recoveryUiPath ?? "/ui/recovery",
      registration_ui_url:
        config.override?.registrationUiPath ?? "/ui/registration",
      verification_ui_url:
        config.override?.verificationUiPath ?? "/ui/verification",
      login_ui_url: config.override?.loginUiPath ?? "/ui/login",
    },
  }
}
