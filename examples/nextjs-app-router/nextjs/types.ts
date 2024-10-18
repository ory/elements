export interface OryConfig {
  /**
   * Sets the base path for proxying requests to Ory during development and previews. Is unset per default for best
   * compatibility.
   *
   * For example, Ory's `/self-service/login/browser` API will be proxied in your application at `/self-service/login/browser`.
   * This proxying is only enabled in development and preview deployments and disabled in production.
   *
   * If you want to proxy Ory's `/self-service/login/browser` API at `/api/self-service/login/browser`, you can set this option to `/api`.
   */
  proxyBasePath?: string

  /**
   * Per default, this handler will strip the cookie domain from
   * the Set-Cookie instruction which is recommended for most set ups.
   *
   * If you are running this app on a subdomain and you want the session and CSRF cookies
   * to be valid for the whole TLD, you can use this setting to force a cookie domain.
   *
   * Please be aware that his method disables the `dontUseTldForCookieDomain` option.
   */
  forceCookieDomain?: string

  /**
   * Per default headers are filtered to forward only a fixed list.
   *
   * If you need to forward additional headers you can use this setting to define them.
   */
  forwardAdditionalHeaders?: string[]

  /**
   * Override the default UI for login, registration, recovery, verification, and settings flows with a page
   * in your project. This is useful if you want to customize the UI for these flows.
   */
  override?: {
    applicationName?: string

    /**
     * Set this to use a custom login UI for the login flow. This path should be relative to the
     * project root. Assuming you have a file at `./app/my-login/page.tsx`, you would set this to
     * `/my-login`.
     */
    login_ui_path?: string

    /**
     * Set this to use a custom registration UI for the registration flow. This path should be relative to the
     * project root. Assuming you have a file at `./app/my-registration/page.tsx`, you would set this to
     * `/my-registration`.
     */
    registration_ui_path?: string

    /**
     * Set this to use a custom recovery UI for the recovery flow. This path should be relative to the
     * project root. Assuming you have a file at `./app/my-recovery/page.tsx`, you would set this to
     * `/my-recovery`.
     */
    recovery_ui_path?: string

    /**
     * Set this to use a custom verification UI for the verification flow. This path should be relative to the
     * project root. Assuming you have a file at `./app/my-verification/page.tsx`, you would set this to
     * `/my-verification`.
     */
    verification_ui_path?: string

    /**
     * Set this to use a custom settings UI for the settings flow. This path should be relative to the
     * project root. Assuming you have a file at `./app/my-settings/page.tsx`, you would set this to
     * `/my-settings`.
     */
    settings_ui_path?: string
  }
}

export type QueryParams = { [key: string]: any }

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export type FlowParams = {
  id: string
  cookie: string | undefined
  return_to: string
}
