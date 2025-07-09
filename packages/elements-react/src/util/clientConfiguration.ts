// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
} from "@ory/client-fetch"
import { Locale } from "../context/intl-context"
import { LocaleMap } from "../locales"

/**
 * The configuration for internationalization (i18n) in Ory Elements.
 *
 * This configuration is used to set the locale and can be used to provide custom translations.
 * The locale is used to determine the language of the UI.
 */
export type IntlConfig = {
  /**
   * The locale to use for internationalization.
   *
   * @defaultValue "en"
   */
  locale: Locale
  /**
   * Provide custom translations for the UI.
   */
  customTranslations?: Partial<LocaleMap>
}

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
export interface OryClientConfiguration {
  /**
   * The SDK configuration.
   * This configuration is used to set the URL of the Ory SDK and any additional options used for the SDK client.
   */
  sdk?: {
    /**
     * The URL the Ory SDK should connect to.
     * This is typically the base URL of your Ory instance.
     */
    url?: string
    /**
     * Additional parameters for the Ory SDK configuration.
     * This can include options like headers, credentials, and other settings.
     */
    options?: Partial<ConfigurationParameters>
  }

  /**
   * The internationalization configuration.
   * This configuration is used to set the locale and any additional options used for the i18n library.
   * The locale is used to determine the language of the UI.
   * The default locale is "en".
   */
  intl?: IntlConfig

  /**
   * The configuration for the project.
   */
  project: AccountExperienceConfiguration
}
