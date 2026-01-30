// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ConfigurationParameters } from "@ory/client-fetch"
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
  project: ProjectConfiguration
}

/**
 * The project configuration for Ory Elements.
 *
 * This configuration is used to set various URLs and settings for the Ory Elements project.
 */
export interface ProjectConfiguration {
  /**
   * The default redirect URI as configured in the Ory Kratos configuration
   */
  default_redirect_url: string
  /**
   * The URL for the error UI.
   */
  error_ui_url: string
  /**
   * The URL for the login UI.
   */
  login_ui_url: string
  /**
   * The URL for the dark logo.
   *
   * Currently unused.
   */
  logo_dark_url?: string
  /**
   * The URL for the light logo on the auth card.
   */
  logo_light_url?: string
  /**
   * The name of the project displayed on the auth card.
   */
  name: string
  /**
   * Whether recovery is enabled.
   *
   * Used to determine if the "Forgot Password" link is shown on the password input elements.
   */
  recovery_enabled: boolean
  /**
   * The URL for the recovery UI.
   */
  recovery_ui_url: string
  /**
   * Whether registration is enabled.
   *
   * Used to determine if the "Sign Up" link is shown on the login card.
   */
  registration_enabled: boolean
  /**
   * The URL for the registration UI.
   */
  registration_ui_url: string
  /**
   * The URL for the settings UI.
   */
  settings_ui_url: string
  /**
   * Whether verification is enabled.
   *
   * Currently unused.
   */
  verification_enabled: boolean
  /**
   * The URL for the verification UI.
   *
   * Currently unused.
   */
  verification_ui_url: string
}
