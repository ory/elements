// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  checkTrustedOrigins,
  handleOryProxy,
  OryProxyOptions,
  oryProxyPaths,
} from "@ory/ssr/proxy"
import { oryProjectApiKey, orySdkUrl } from "../env"
import { registerProxy } from "../registration"

/**
 * Options for {@link createOryProxyHandler}.
 *
 * @public
 */
export type OryProxyHandlerOptions = Omit<
  OryProxyOptions,
  "sdkUrl" | "projectApiKey" | "trustedOrigins"
> & {
  /**
   * The origins this deployment serves. An entry is an origin without a path,
   * such as `http://localhost:5173`. To match several origins, use `*` in the
   * host as a glob. Each `*` matches one or more letters, digits, or hyphens
   * within one DNS label, and never a dot. A `*` can't make up the whole label
   * right before a public suffix from the Public Suffix List, such as
   * `vercel.app` or `com`: `https://*.vercel.app` is rejected,
   * `https://my-app-*-my-team.vercel.app` is accepted. For any other origin,
   * the helpers use `ORY_SDK_URL` and log a warning.
   *
   * @example ["http://localhost:5173", "https://my-app-*-my-team.vercel.app"]
   */
  trustedOrigins: ReadonlyArray<string>
}

/**
 * A route entry for `app/routes.ts`.
 *
 * @public
 */
export type OryProxyRouteConfigEntry = {
  id: string
  path: string
  file: string
}

/**
 * The handler to export as the `loader` and `action` of the proxy route.
 *
 * @public
 */
export type OryProxyHandler = (args: { request: Request }) => Promise<Response>

/**
 * Registers the Ory API paths on the proxy resource route. React Router only
 * runs a route's code for URLs that match a route, so each Ory path needs an
 * entry.
 *
 * @example
 * ```ts title="app/routes.ts"
 * import { type RouteConfig, index, route } from "@react-router/dev/routes"
 * import { oryProxyRoutes } from "@ory/react-router/proxy"
 *
 * export default [
 *   index("routes/home.tsx"),
 *   route("auth/login", "routes/login.tsx"),
 *   ...oryProxyRoutes("routes/ory-proxy.ts"),
 * ] satisfies RouteConfig
 * ```
 *
 * @param file - The route module that exports {@link createOryProxyHandler}
 * as `loader` and `action`, relative to the `app` directory.
 * @public
 */
export function oryProxyRoutes(file: string): OryProxyRouteConfigEntry[] {
  return oryProxyPaths.map((prefix) => ({
    id: `ory-proxy-${prefix.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`,
    path: `${prefix.replace(/^\//, "")}/*`,
    file,
  }))
}

/**
 * Creates the handler of a resource route that serves the Ory APIs on the
 * app's origin, so Ory's cookies are first-party in local development and
 * preview deployments. In production, use a custom domain on Ory Network, or
 * your own domain with Ory Enterprise License.
 *
 * Reads `ORY_SDK_URL`, and `ORY_PROJECT_API_TOKEN` to sign the base URL
 * rewrite for origins in `trustedOrigins`.
 *
 * Creating the handler registers the proxy for the whole process: the flow
 * helpers and `getOryBaseUrl` then use the request's origin for origins in
 * `trustedOrigins`. A process has one proxy configuration, so call it only in
 * the proxy route module.
 *
 * @example
 * ```ts title="app/routes/ory-proxy.ts"
 * import { createOryProxyHandler } from "@ory/react-router/proxy"
 * import config from "../ory.config"
 *
 * const proxy = createOryProxyHandler({
 *   ...config,
 *   trustedOrigins: ["http://localhost:5173"],
 * })
 *
 * export const loader = proxy
 * export const action = proxy
 * ```
 *
 * @param options - The proxy configuration. `trustedOrigins` is required.
 * @public
 */
export function createOryProxyHandler(
  options: OryProxyHandlerOptions,
): OryProxyHandler {
  checkTrustedOrigins(options.trustedOrigins, "@ory/react-router")
  const trustedOrigins = registerProxy(options.trustedOrigins)
  return async ({ request }) => {
    const response = await handleOryProxy(request, {
      ...options,
      trustedOrigins,
      sdkUrl: orySdkUrl(),
      projectApiKey: oryProjectApiKey(),
    })
    return response ?? new Response(null, { status: 404 })
  }
}
