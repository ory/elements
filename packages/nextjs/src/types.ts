// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { AccountExperienceConfiguration } from "@ory/client-fetch"

/**
 * The type of the Ory configuration object. This type is used to configure the Ory SDK in a Next.js application.
 *
 * @public
 */
export type OryConfig = {
  /**
   * Sets the base path for proxying requests to Ory during development and previews. Is unset per default for best
   * compatibility.
   *
   * If unset, requests made by the Ory SDK (for example to `/self-service/login/browser`) will be made to on the current
   * Next.js' application route `/self-service/login/browser`.
   * This proxying is only enabled in development and preview deployments and disabled in production.
   *
   * To change the base path for these requests, set this option to the desired base path.
   * For example, if set to `/api`, requests made by the Ory SDK to `/self-service/login/browser` will be made to
   * `/api/self-service/login/browser`.
   */
  proxyBasePath?: string

  /**
   * Per default, this handler will strip the cookie domain from
   * the Set-Cookie instruction which is recommended for most set ups.
   *
   * If you are running this app on a subdomain and you want the session and CSRF cookies
   * to be valid for the whole TLD, you can use this setting to force a cookie domain.
   */
  forceCookieDomain?: string

  /**
   * Per default headers are filtered to forward only a fixed list.
   *
   * If you need to forward additional headers you can use this setting to define them.
   */
  forwardAdditionalHeaders?: string[]
} & (
  | {
      // for compatibility with the old config
      project: undefined
      /**
       * Override the default UI for login, registration, recovery, verification, and settings flows with a page
       * in your project. This is useful if you want to customize the UI for these flows.
       * @deprecated Use the top level properties instead.
       */
      override?: {
        applicationName?: string

        /**
         * Set this to use a custom login UI for the login flow. This path should be relative to the
         * project root. Assuming you have a file at `./app/my-login/page.tsx`, you would set this to
         * `/my-login`.
         */
        loginUiPath?: string

        /**
         * Set this to use a custom registration UI for the registration flow. This path should be relative to the
         * project root. Assuming you have a file at `./app/my-registration/page.tsx`, you would set this to
         * `/my-registration`.
         */
        registrationUiPath?: string

        /**
         * Set this to use a custom recovery UI for the recovery flow. This path should be relative to the
         * project root. Assuming you have a file at `./app/my-recovery/page.tsx`, you would set this to
         * `/my-recovery`.
         */
        recoveryUiPath?: string

        /**
         * Set this to use a custom verification UI for the verification flow. This path should be relative to the
         * project root. Assuming you have a file at `./app/my-verification/page.tsx`, you would set this to
         * `/my-verification`.
         */
        verificationUiPath?: string

        /**
         * Set this to use a custom settings UI for the settings flow. This path should be relative to the
         * project root. Assuming you have a file at `./app/my-settings/page.tsx`, you would set this to
         * `/my-settings`.
         */
        settingsUiPath?: string

        /**
         * Set this to use a custom default redirect URI. This path should be relative to your application's base URL.
         */
        defaultRedirectUri?: string

        /**
         * Set this to use a custom error UI for the error flow. This path should be relative to the
         * project root. Assuming you have a file at `./app/my-error/page.tsx`, you would set this to
         * `/my-error`.
         */
        errorUiPath?: string
      }
    }
  | {
      project: AccountExperienceConfiguration
    }
)

export type QueryParams = { [key: string]: string | string[] | undefined }

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export type FlowParams = {
  id: string
  cookie: string | undefined
  return_to: string
}
