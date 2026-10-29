// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError, LogoutFlow, Session } from "@ory/client-fetch"
import {
  createLogoutFlow,
  getError as getOryError,
  getSession as getOrySession,
} from "@ory/ssr"
import { getRequest } from "@tanstack/react-start/server"
import { orySdkUrl } from "./env"
import { preventSharedCaching, resolveRequestOryBaseUrl } from "./ory-url"
import { OrySearchParams, toURLSearchParams } from "./search"

/**
 * Returns the session of the browser that sent the current request, or `null`
 * when it has none. Call it from the handler of a `createServerFn`.
 *
 * @example
 * ```ts
 * export const sessionFn = createServerFn({ method: "GET" }).handler(() =>
 *   getServerSession(),
 * )
 * ```
 *
 * @returns The session, or `null`.
 * @public
 */
export function getServerSession(): Promise<Session | null> {
  preventSharedCaching()
  return getOrySession(getRequest(), { sdkUrl: orySdkUrl() })
}

/**
 * Creates a logout flow for the browser that sent the current request. Link
 * to its `logout_url` to sign the user out. Call it from the handler of a
 * `createServerFn`.
 *
 * @example
 * ```ts
 * export const logoutFlowFn = createServerFn({ method: "GET" }).handler(() =>
 *   getLogoutFlow(),
 * )
 * ```
 *
 * @param options - `returnTo` is where Ory sends the browser after logout.
 * @returns The logout flow.
 * @public
 */
export function getLogoutFlow(
  options: { returnTo?: string } = {},
): Promise<LogoutFlow> {
  preventSharedCaching()
  const request = getRequest()
  return createLogoutFlow(request, {
    sdkUrl: orySdkUrl(),
    baseUrl: resolveRequestOryBaseUrl(request),
    returnTo: options.returnTo,
  })
}

/**
 * Fetches the error that Ory redirected the browser to the error page with.
 * Call it from the handler of a `createServerFn`, like {@link getLoginFlow}.
 *
 * @param search - The search params of the error page.
 * @returns The flow error, or an error and description from the search params.
 * @public
 */
export function getError(
  search: OrySearchParams = {},
): Promise<FlowError | { error: string; error_description: string }> {
  preventSharedCaching()
  const request = getRequest()
  const url = new URL(request.url)
  url.search = toURLSearchParams(search).toString()
  return getOryError(
    { url, headers: request.headers },
    { sdkUrl: orySdkUrl(), baseUrl: resolveRequestOryBaseUrl(request) },
  )
}
