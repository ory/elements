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
   * @deprecated Use `project.name` instead.
   * @see {@link AccountExperienceConfiguration.name}
   */
  name?: string

  /**
   * An optional logo URL to display in the UI instead of the name.
   * @deprecated Use `project.logo_light_url` instead.
   * @see {@link AccountExperienceConfiguration.logo_light_url}
   */
  logoUrl?: string

  sdk: {
    url: string
    options?: Partial<ConfigurationParameters>
  }

  project: AccountExperienceConfiguration
  intl?: IntlConfig
}
