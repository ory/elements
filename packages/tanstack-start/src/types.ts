// SPDX-License-Identifier: Apache-2.0

import type {
  AccountExperienceConfiguration,
  FetchAPI,
  FlowError,
  LoginFlow,
  LogoutFlow,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"

/** Query parameters accepted by Ory browser flows. @public */
export type QueryParams = Record<string, string | string[] | undefined>

/** Configuration shared by the TanStack Start server helpers. @public */
export interface OryTanStackStartOptions {
  /** The public Ory SDK URL used in browser-visible responses. */
  sdkUrl: string
  /** An optional private URL used only for server-to-server Ory requests. */
  serverSdkUrl?: string
  /** Ory Elements account-experience routes. */
  project: Partial<AccountExperienceConfiguration>
  /** Canonical application URL when `request.url` is not browser-facing. */
  appUrl?: string
  /** Custom fetch implementation, primarily for nonstandard runtimes. */
  fetchApi?: FetchAPI
}

/** Configuration for the Ory request proxy. @public */
export interface OryMiddlewareOptions {
  /** The public Ory SDK URL used in browser-visible responses. */
  sdkUrl: string
  /** An optional private URL used only for server-to-server Ory requests. */
  serverSdkUrl?: string
  /** Ory Elements account-experience routes. */
  project: Partial<AccountExperienceConfiguration>
  /** Canonical application URL when `request.url` is not browser-facing. */
  appUrl?: string
  /** Custom fetch implementation, primarily for nonstandard runtimes. */
  fetchApi?: FetchAPI
  /** Additional request headers that may be forwarded to Ory. */
  forwardAdditionalHeaders?: string[]
  /** Override the domain written to proxied Ory cookies. */
  forceCookieDomain?: string
  /** Token used to authorize Ory base URL rewriting. */
  projectApiToken?: string
}

/** Request data needed to load an Ory browser flow. @public */
export interface FlowRequest {
  /** The incoming TanStack Start request, including the browser cookie. */
  request: Request
  /** Validated route search parameters, including Ory's optional flow ID. */
  params: QueryParams
}

/** Error data rendered by the Ory Elements error screen. @public */
export type OryFlowError =
  | FlowError
  | { error: string; error_description: string }

/** Server-side Ory operations for a TanStack Start application. @public */
export interface OryServer {
  /** Returns the SDK URL Elements should use for this request. */
  getBrowserSdkUrl(args: { request: Request }): string
  /** Loads an existing login flow or redirects to start one. */
  getLoginFlow(args: FlowRequest): Promise<LoginFlow>
  /** Loads an existing registration flow or redirects to start one. */
  getRegistrationFlow(args: FlowRequest): Promise<RegistrationFlow>
  /** Loads an existing recovery flow or redirects to start one. */
  getRecoveryFlow(args: FlowRequest): Promise<RecoveryFlow>
  /** Loads an existing verification flow or redirects to start one. */
  getVerificationFlow(args: FlowRequest): Promise<VerificationFlow>
  /** Loads an existing settings flow or redirects to start one. */
  getSettingsFlow(args: FlowRequest): Promise<SettingsFlow>
  /** Returns the current session, or `null` when Ory responds with 401. */
  getSession(args: { request: Request }): Promise<Session | null>
  /** Resolves an Ory flow error or OAuth error query parameters. */
  getError(args: { params: QueryParams }): Promise<OryFlowError>
  /** Creates a browser logout flow for the current session. */
  getLogoutFlow(args: {
    /** The incoming request containing the Ory session cookie. */
    request: Request
    /** Optional URL Ory should return the browser to after logout. */
    returnTo?: string
  }): Promise<LogoutFlow>
}
