// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowError,
  FlowType,
  LoginFlow,
  LogoutFlow,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"
import {
  createLogoutFlow,
  getError as getOryError,
  getFlow,
  getSession,
} from "@ory/ssr"
import { orySdkUrl } from "./env"
import { resolveBaseUrl, toOryRequest, toRedirect } from "./request"

async function fetchFlow<T extends object>(
  type: FlowType,
  request: Request,
  route: string,
): Promise<T> {
  const sdkUrl = orySdkUrl()
  const oryRequest = toOryRequest(request)
  const result = await getFlow<T>(type, oryRequest, {
    sdkUrl,
    route,
    baseUrl: resolveBaseUrl(oryRequest, sdkUrl),
  })
  if ("redirectTo" in result) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw toRedirect(result.redirectTo, route, oryRequest.url)
  }
  return result.flow
}

/**
 * Fetches the login flow for a React Router `loader`. Without a `flow` query
 * parameter, or when the flow expired, it throws a redirect that starts a new
 * flow.
 *
 * @example
 * ```tsx
 * import { Login } from "@ory/elements-react/theme"
 * import { getLoginFlow } from "@ory/react-router"
 * import type { Route } from "./+types/login"
 * import config from "../ory.config"
 *
 * export async function loader({ request }: Route.LoaderArgs) {
 *   return { flow: await getLoginFlow(request, config) }
 * }
 *
 * export default function LoginPage({ loaderData }: Route.ComponentProps) {
 *   return <Login flow={loaderData.flow} config={config} />
 * }
 * ```
 *
 * @param request - The `request` passed to the loader.
 * @param config - The Ory configuration object.
 * @public
 */
export async function getLoginFlow(
  request: Request,
  config: { project: { login_ui_url: string } },
): Promise<LoginFlow> {
  return fetchFlow(FlowType.Login, request, config.project.login_ui_url)
}

/**
 * Fetches the registration flow for a React Router `loader`. Without a `flow`
 * query parameter, or when the flow expired, it throws a redirect that starts
 * a new flow.
 *
 * @param request - The `request` passed to the loader.
 * @param config - The Ory configuration object.
 * @public
 */
export async function getRegistrationFlow(
  request: Request,
  config: { project: { registration_ui_url: string } },
): Promise<RegistrationFlow> {
  return fetchFlow(
    FlowType.Registration,
    request,
    config.project.registration_ui_url,
  )
}

/**
 * Fetches the recovery flow for a React Router `loader`. Without a `flow`
 * query parameter, or when the flow expired, it throws a redirect that starts
 * a new flow.
 *
 * @param request - The `request` passed to the loader.
 * @param config - The Ory configuration object.
 * @public
 */
export async function getRecoveryFlow(
  request: Request,
  config: { project: { recovery_ui_url: string } },
): Promise<RecoveryFlow> {
  return fetchFlow(FlowType.Recovery, request, config.project.recovery_ui_url)
}

/**
 * Fetches the verification flow for a React Router `loader`. Without a `flow`
 * query parameter, or when the flow expired, it throws a redirect that starts
 * a new flow.
 *
 * @param request - The `request` passed to the loader.
 * @param config - The Ory configuration object.
 * @public
 */
export async function getVerificationFlow(
  request: Request,
  config: { project: { verification_ui_url: string } },
): Promise<VerificationFlow> {
  return fetchFlow(
    FlowType.Verification,
    request,
    config.project.verification_ui_url,
  )
}

/**
 * Fetches the settings flow for a React Router `loader`. Without a `flow`
 * query parameter, or when the flow expired, it throws a redirect that starts
 * a new flow. Without a session, Ory redirects to the login page.
 *
 * @param request - The `request` passed to the loader.
 * @param config - The Ory configuration object.
 * @public
 */
export async function getSettingsFlow(
  request: Request,
  config: { project: { settings_ui_url: string } },
): Promise<SettingsFlow> {
  return fetchFlow(FlowType.Settings, request, config.project.settings_ui_url)
}

/**
 * Returns the URL the browser uses to reach Ory for this request. The flow,
 * logout, and error helpers use the same URL and attach it to the flows and
 * errors they return, where the Ory Elements components read it. Return it
 * from the loader and pass it as `baseUrl` to `SessionProvider`.
 *
 * The URL is the request's origin only when the app registers the proxy
 * route from `@ory/react-router/proxy` and the origin is in its
 * `trustedOrigins`. Otherwise it is `ORY_SDK_URL`, and a warning with the fix
 * is logged once when that cannot work.
 *
 * @example
 * ```tsx
 * import { SessionProvider } from "@ory/elements-react/client"
 * import { Settings } from "@ory/elements-react/theme"
 * import { getOryBaseUrl, getSettingsFlow } from "@ory/react-router"
 * import type { Route } from "./+types/settings"
 * import config from "../ory.config"
 *
 * export async function loader({ request }: Route.LoaderArgs) {
 *   return {
 *     flow: await getSettingsFlow(request, config),
 *     baseUrl: getOryBaseUrl(request),
 *   }
 * }
 *
 * export default function SettingsPage({ loaderData }: Route.ComponentProps) {
 *   return (
 *     <SessionProvider baseUrl={loaderData.baseUrl}>
 *       <Settings flow={loaderData.flow} config={config} />
 *     </SessionProvider>
 *   )
 * }
 * ```
 *
 * @param request - The `request` passed to the loader.
 * @returns The browser URL.
 * @public
 */
export function getOryBaseUrl(request: Request): string {
  return resolveBaseUrl(toOryRequest(request), orySdkUrl())
}

/**
 * Fetches the session of the request's cookies.
 *
 * @example
 * ```ts
 * import { getServerSession } from "@ory/react-router"
 *
 * export async function loader({ request }: Route.LoaderArgs) {
 *   return { session: await getServerSession(request) }
 * }
 * ```
 *
 * @param request - The `request` passed to the loader.
 * @returns The session, or `null` when the request has no valid session.
 * @public
 */
export function getServerSession(request: Request): Promise<Session | null> {
  return getSession(toOryRequest(request), { sdkUrl: orySdkUrl() })
}

/**
 * Creates a logout flow for the session of the request's cookies. Link to
 * `logout_url` to sign the user out.
 *
 * @param request - The `request` passed to the loader.
 * @param options - Where Ory sends the browser after logout.
 * @public
 */
export function getLogoutFlow(
  request: Request,
  options: { returnTo?: string } = {},
): Promise<LogoutFlow> {
  const sdkUrl = orySdkUrl()
  const oryRequest = toOryRequest(request)
  return createLogoutFlow(oryRequest, {
    sdkUrl,
    baseUrl: resolveBaseUrl(oryRequest, sdkUrl),
    returnTo: options.returnTo,
  })
}

/**
 * Fetches the error shown on the error page. Reads the `id` query parameter
 * for errors from Ory, or `error` and `error_description` for OAuth2 errors.
 *
 * @param request - The `request` passed to the loader.
 * @public
 */
export function getError(
  request: Request,
): Promise<FlowError | { error: string; error_description: string }> {
  const sdkUrl = orySdkUrl()
  const oryRequest = toOryRequest(request)
  return getOryError(oryRequest, {
    sdkUrl,
    baseUrl: resolveBaseUrl(oryRequest, sdkUrl),
  })
}
