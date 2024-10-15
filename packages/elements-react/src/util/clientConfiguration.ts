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

  /**
   * An optional favicon URL to display in the UI.
   */
  favicon?: string

  /**
   * The SDK configuration.
   */
  sdk: {
    /**
     * Your SDK URL.
     *
     * You can find it here: https://console.ory.sh/projects/current/settings
     */
    url: string

    /**
     * Optional SDK configuration parameters.
     */
    options?: Partial<ConfigurationParameters>
  }

  /**
   * Enable or disable registration.
   *
   * Defaults to true.
   */
  registration_enabled?: boolean
  /**
   * Enable or disable verification.
   *
   * Defaults to true.
   */
  verification_enabled?: boolean
  /**
   * Enable or disable verification.
   *
   * Defaults to true.
   */
  recovery_enabled?: boolean

  /**
   * The URL to redirect to when the user wants to recover their account.
   *
   * Defaults to `/recovery`.
   */
  recovery_ui_url?: string

  /**
   * The URL to redirect to when the user wants to register.
   *
   * Defaults to `/registration`.
   */
  registration_ui_url?: string

  /**
   * The URL to redirect to when the user wants to verify their account.
   *
   * Defaults to `/verification`.
   */
  verification_ui_url?: string

  /**
   * The URL to redirect to when the user wants to log in.
   *
   * Defaults to `/login`.
   */
  login_ui_url?: string
}
