export interface CreateApiHandlerOptions {
  /**
   * Set the Ory SDK URL. Per default this is taken from the
   * `ORY_SDK_URL` environment variable.
   */
  orySdkUrl?: string

  /**
   * Sets the base path for proxying requests to Ory during development and previews. Defaults
   * to `/` for easiest set up.
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
}
