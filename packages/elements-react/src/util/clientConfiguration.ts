// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
} from "@ory/client-fetch"
import { IntlContextProps } from "../context/intl-context"

export type IntlConfig = IntlContextProps

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

  project:
    | {
        registration_enabled: boolean
        verification_enabled: boolean
        recovery_enabled: boolean

        recovery_ui_url: string
        registration_ui_url: string
        verification_ui_url: string
        login_ui_url: string
      }
    | AccountExperienceConfiguration
  intl?: IntlConfig
}
