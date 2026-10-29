// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"
import { getFlow, requestOrigin } from "@ory/ssr"
import { redirect } from "@tanstack/react-router"
import { getRequest } from "@tanstack/react-start/server"
import { orySdkUrl } from "./env"
import {
  preventSharedCaching,
  privateNoStore,
  resolveRequestOryBaseUrl,
} from "./ory-url"
import { OrySearchParams, toURLSearchParams } from "./search"

async function fetchFlow<T extends object>(
  type: FlowType,
  route: string,
  search: OrySearchParams,
): Promise<T> {
  preventSharedCaching()
  const request = getRequest()
  const sdkUrl = orySdkUrl()
  const url = new URL(route, requestOrigin(request))
  url.search = toURLSearchParams(search).toString()

  const result = await getFlow<T>(
    type,
    { url, headers: request.headers },
    { sdkUrl, route, baseUrl: resolveRequestOryBaseUrl(request) },
  )
  if ("redirectTo" in result) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({
      href: result.redirectTo,
      reloadDocument: true,
      headers: privateNoStore,
    })
  }
  return result.flow
}

/**
 * Fetches the login flow named by the `flow` search param, or redirects to Ory
 * to create a new one. Call it from the handler of a `createServerFn` so it
 * runs on the server with the browser's cookies.
 *
 * @example
 * ```ts
 * // src/ory.functions.ts
 * import { createServerFn } from "@tanstack/react-start"
 * import { getLoginFlow, validateOrySearch } from "@ory/tanstack-start"
 * import config from "./ory.config"
 *
 * export const loginFlowFn = createServerFn({ method: "GET" })
 *   .validator(validateOrySearch)
 *   .handler(({ data }) => getLoginFlow(config, data))
 *
 * // src/routes/login.tsx
 * export const Route = createFileRoute("/login")({
 *   loaderDeps: ({ search }) => search,
 *   loader: ({ deps }) => loginFlowFn({ data: deps }),
 *   component: LoginPage,
 * })
 * ```
 *
 * @param config - The Ory configuration. `project.login_ui_url` is the route of the login page.
 * @param search - The search params of the login page.
 * @returns The login flow.
 * @throws A TanStack Router redirect when the flow must be created or restarted.
 * @public
 */
export function getLoginFlow(
  config: { project: { login_ui_url: string } },
  search: OrySearchParams = {},
): Promise<LoginFlow> {
  return fetchFlow(FlowType.Login, config.project.login_ui_url, search)
}

/**
 * Fetches the registration flow named by the `flow` search param, or
 * redirects to Ory to create a new one. Call it from the handler of a
 * `createServerFn`, like {@link getLoginFlow}.
 *
 * @param config - The Ory configuration. `project.registration_ui_url` is the route of the registration page.
 * @param search - The search params of the registration page.
 * @returns The registration flow.
 * @throws A TanStack Router redirect when the flow must be created or restarted.
 * @public
 */
export function getRegistrationFlow(
  config: { project: { registration_ui_url: string } },
  search: OrySearchParams = {},
): Promise<RegistrationFlow> {
  return fetchFlow(
    FlowType.Registration,
    config.project.registration_ui_url,
    search,
  )
}

/**
 * Fetches the recovery flow named by the `flow` search param, or redirects to
 * Ory to create a new one. Call it from the handler of a `createServerFn`,
 * like {@link getLoginFlow}.
 *
 * @param config - The Ory configuration. `project.recovery_ui_url` is the route of the recovery page.
 * @param search - The search params of the recovery page.
 * @returns The recovery flow.
 * @throws A TanStack Router redirect when the flow must be created or restarted.
 * @public
 */
export function getRecoveryFlow(
  config: { project: { recovery_ui_url: string } },
  search: OrySearchParams = {},
): Promise<RecoveryFlow> {
  return fetchFlow(FlowType.Recovery, config.project.recovery_ui_url, search)
}

/**
 * Fetches the verification flow named by the `flow` search param, or
 * redirects to Ory to create a new one. Call it from the handler of a
 * `createServerFn`, like {@link getLoginFlow}.
 *
 * @param config - The Ory configuration. `project.verification_ui_url` is the route of the verification page.
 * @param search - The search params of the verification page.
 * @returns The verification flow.
 * @throws A TanStack Router redirect when the flow must be created or restarted.
 * @public
 */
export function getVerificationFlow(
  config: { project: { verification_ui_url: string } },
  search: OrySearchParams = {},
): Promise<VerificationFlow> {
  return fetchFlow(
    FlowType.Verification,
    config.project.verification_ui_url,
    search,
  )
}

/**
 * Fetches the settings flow named by the `flow` search param, or redirects to
 * Ory to create a new one. Ory redirects to the login page when there is no
 * session. Call it from the handler of a `createServerFn`, like
 * {@link getLoginFlow}.
 *
 * @param config - The Ory configuration. `project.settings_ui_url` is the route of the settings page.
 * @param search - The search params of the settings page.
 * @returns The settings flow.
 * @throws A TanStack Router redirect when the flow must be created or restarted.
 * @public
 */
export function getSettingsFlow(
  config: { project: { settings_ui_url: string } },
  search: OrySearchParams = {},
): Promise<SettingsFlow> {
  return fetchFlow(FlowType.Settings, config.project.settings_ui_url, search)
}
