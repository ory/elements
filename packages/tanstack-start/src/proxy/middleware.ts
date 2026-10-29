// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { requestOrigin, type OryProxyState } from "@ory/ssr"
import {
  checkTrustedOrigins,
  handleOryProxy,
  isTrustedOrigin,
  type OryProxyOptions,
} from "@ory/ssr/proxy"
import { createMiddleware } from "@tanstack/react-start"
import { oryProjectApiKey, orySdkUrl } from "../env"
import { keepSharedCachingPrevented } from "../ory-url"

/**
 * Options for {@link oryProxyMiddleware}. The SDK URL and the API token come
 * from the `ORY_SDK_URL` and `ORY_PROJECT_API_TOKEN` environment variables.
 *
 * @public
 */
export type OryProxyMiddlewareOptions = Omit<
  OryProxyOptions,
  "sdkUrl" | "projectApiKey" | "trustedOrigins"
> & {
  /**
   * The origins this deployment serves. An entry is an origin without a path,
   * such as `http://localhost:3000`. To match several origins, use `*` in the
   * host as a glob. Each `*` matches one or more letters, digits, or hyphens
   * within one DNS label, and never a dot. A `*` can't make up the whole label
   * right before a public suffix from the Public Suffix List, such as
   * `vercel.app` or `com`: `https://*.vercel.app` is rejected,
   * `https://my-app-*-my-team.vercel.app` is accepted.
   *
   * The proxy reports the app origin to Ory only for these origins. For any
   * other origin, the helpers use the Ory SDK URL and log a warning.
   *
   * @example ["http://localhost:3000", "https://my-app-*-my-team.vercel.app"]
   */
  trustedOrigins: ReadonlyArray<string>
}

function proxyState(
  request: Request,
  trustedOrigins: ReadonlyArray<string>,
): OryProxyState {
  return isTrustedOrigin(requestOrigin(request), trustedOrigins)
    ? "trusted-origin"
    : "untrusted-origin"
}

/**
 * Creates request middleware that serves Ory's APIs on the app's own origin,
 * so Ory's cookies are first-party during local development and on preview
 * deployments. In production, use a custom domain on Ory Network, or your own
 * domain with the Ory Enterprise License: through the proxy, Ory sees your
 * server as the client instead of your users.
 *
 * Register it after Start's CSRF middleware. Once `src/start.ts` defines a
 * `startInstance`, Start no longer adds its default CSRF middleware.
 *
 * @example
 * ```ts
 * // src/start.ts
 * import { oryProxyMiddleware } from "@ory/tanstack-start/proxy"
 * import { createCsrfMiddleware, createStart } from "@tanstack/react-start"
 *
 * const csrfMiddleware = createCsrfMiddleware({
 *   filter: (ctx) => ctx.handlerType === "serverFn",
 * })
 *
 * const oryProxy = oryProxyMiddleware({
 *   trustedOrigins: ["http://localhost:3000"],
 * })
 *
 * export const startInstance = createStart(() => ({
 *   requestMiddleware: [csrfMiddleware, oryProxy],
 * }))
 * ```
 *
 * @param options - The proxy options. `trustedOrigins` is required.
 * @returns The request middleware.
 * @throws TypeError when `trustedOrigins` is empty or has an invalid entry.
 * @public
 */
export function oryProxyMiddleware(options: OryProxyMiddlewareOptions) {
  checkTrustedOrigins(options.trustedOrigins, "@ory/tanstack-start")
  return createMiddleware().server(async ({ request, next }) => {
    const response = await handleOryProxy(request, {
      ...options,
      sdkUrl: orySdkUrl(),
      projectApiKey: oryProjectApiKey(),
    })
    if (response) {
      return response
    }
    const result = await next({
      context: { oryProxy: proxyState(request, options.trustedOrigins) },
    })
    const appResponse = keepSharedCachingPrevented(result.response)
    return appResponse === result.response
      ? result
      : { ...result, response: appResponse }
  })
}
