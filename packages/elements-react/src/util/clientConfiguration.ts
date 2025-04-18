// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
} from "@ory/client-fetch"
import { IntlContextProps } from "../context/intl-context"

export type IntlConfig = IntlContextProps

/**
 * The configuration for Ory Elements.
 *
 * This configuration is used to customize the behavior and appearance of Ory Elements.
 *
 * By setting UI urls, you can override the default URLs for the login, registration, recovery, and verification flows.
 *
 * You can also set the name of the application, the logo URL, and the SDK configuration.
 * By default, the name and logo are displayed in the card's header.
 */
export type OryClientConfiguration = {
  /**
   * An optional logo URL to display in the UI instead of the name.
   * @deprecated Use `project.logo_light_url` instead.
   */
  logoUrl?: string

  /**
   * The SDK configuration.
   * This configuration is used to set the URL of the Ory SDK and any additional options used for the SDK client.
   */
  sdk: {
    url: string
    options?: Partial<ConfigurationParameters>
  }

  /**
   * The internationalization configuration.
   * This configuration is used to set the locale and any additional options used for the i18n library.
   * The locale is used to determine the language of the UI.
   * The default locale is "en".
   */
  intl?: IntlConfig
} & (
  | {
      /**
       * The name of the application the user is logging in to.
       * @deprecated Use `project.name` instead.
       */
      name: string
      /**
       * The configuration for the project.
       */
      project: Omit<AccountExperienceConfiguration, "name"> & { name?: string }
    }
  | {
      /**
       * The name of the application the user is logging in to.
       * @deprecated Use `project.name` instead.
       */
      name?: string
      /**
       * The configuration for the project.
       */
      project: AccountExperienceConfiguration
    }
)
