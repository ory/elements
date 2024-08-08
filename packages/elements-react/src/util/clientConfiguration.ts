// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ConfigurationParameters } from "@ory/client-fetch"

export type OryClientConfiguration = {
  /**
   * The name of the application the user is logging in to.
   */
  name: string

  /**
   * An optional logo URL to display in the UI instead of the name.
   */
  logoUrl?: string

  stylesheet?: string

  favicon?: string

  sdk: {
    url: string
    options?: Partial<ConfigurationParameters>
  }

  project: {
    registrationEnabled: boolean
    verificationEnabled: boolean
    recoveryEnabled: boolean
  }
}
