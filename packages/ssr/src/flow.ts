// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ApiResponse, FlowType, handleFlowError } from "@ory/client-fetch"

import { frontendClient, withoutTrailingSlash } from "./client"
import {
  browserFlowUrl,
  searchParamsToQuery,
  urlQueryToSearchParams,
} from "./query"
import { attachBaseUrl } from "./base-url"
import { rewriteJsonResponse } from "./rewrite"
import type {
  FlowResolution,
  FlowResult,
  OryRequest,
  QueryParams,
} from "./types"

/**
 * Restores the `options` field on input node attributes that the pinned
 * `@ory/client-fetch` SDK strips during its generated `FromJSON` step. The
 * SDK rebuilds each attribute object from a hard-coded field list and drops
 * anything it does not recognize, including the enum options the Kratos
 * backend emits for schema-driven dropdowns. Remove this helper once the
 * published SDK carries the field natively.
 *
 * Nodes are matched by `attributes.name` rather than by positional index so
 * that SDK reordering, insertion, or removal of nodes cannot graft options
 * onto the wrong field. Each element of the raw options array is validated
 * to be a non-null object before it is copied over, so malformed JSON
 * cannot inject arbitrary primitive values.
 */
function reattachInputOptions<T>(parsed: T, rawJson: unknown): void {
  const raw = rawJson as {
    ui?: {
      nodes?: Array<{
        attributes?: { name?: unknown; options?: unknown }
      }>
    }
  }
  const parsedAny = parsed as {
    ui?: {
      nodes?: Array<{
        attributes?: { name?: unknown } & Record<string, unknown>
      }>
    }
  }
  const rawNodes = raw?.ui?.nodes
  const parsedNodes = parsedAny?.ui?.nodes
  if (!Array.isArray(rawNodes) || !Array.isArray(parsedNodes)) {
    return
  }

  const rawOptionsByName = new Map<string, unknown[]>()
  for (const node of rawNodes) {
    const name = node?.attributes?.name
    const options = node?.attributes?.options
    if (
      typeof name === "string" &&
      Array.isArray(options) &&
      options.length > 0 &&
      options.every((o) => typeof o === "object" && o !== null)
    ) {
      rawOptionsByName.set(name, options)
    }
  }
  if (rawOptionsByName.size === 0) {
    return
  }

  for (const node of parsedNodes) {
    const attrs = node?.attributes
    if (!attrs || typeof attrs.name !== "string") {
      continue
    }
    const options = rawOptionsByName.get(attrs.name)
    if (options) {
      attrs["options"] = options
    }
  }
}

function onValidationError<T>(value: T): T {
  return value
}

function warnOnRawResponseError(err: unknown) {
  console.warn(
    "[@ory/ssr] Failed to read the raw flow response. Select fields from `enum` constraints in the identity schema may render as plain inputs.",
    err,
  )
}

/**
 * Options for {@link resolveFlow}.
 *
 * @public
 */
export type ResolveFlowOptions<T> = {
  /**
   * The URL the browser uses to reach Ory, from {@link resolveOryBaseUrl}.
   */
  baseUrl: string
  /**
   * The app's own page for this flow, for example `/login`.
   */
  route: string
  /**
   * Applied to a fetched flow, for example to rewrite Ory URLs to `baseUrl`.
   */
  transform?: (flow: T) => T
  /**
   * Called when the raw flow response cannot be read. Defaults to logging a
   * warning.
   */
  onRawResponseError?: (error: unknown) => void
}

/**
 * Resolves a self-service flow from the query parameters of a page request,
 * with a caller-provided function that fetches the flow from Ory.
 *
 * Without a `flow` query parameter, it returns a redirect that starts a new
 * flow. When Ory reports the flow as missing or expired, or requires the
 * browser to go somewhere else, it returns that redirect instead of the flow.
 *
 * Use {@link getFlow} unless you need to control how the flow is fetched.
 *
 * @param flowType - The type of the flow.
 * @param query - The query parameters of the page request.
 * @param fetchFlowRaw - Fetches the flow with the ID from the `flow` query parameter.
 * @param opts - The browser URL, the app's route for the flow, and optional hooks.
 * @returns The flow, or the redirect.
 * @public
 */
export async function resolveFlow<T extends object>(
  flowType: FlowType,
  query: QueryParams,
  fetchFlowRaw: () => Promise<ApiResponse<T>>,
  opts: ResolveFlowOptions<T>,
): Promise<FlowResolution<T>> {
  const restartUrl = (useFlowId?: string) => {
    if (!useFlowId) {
      return browserFlowUrl(query, flowType, opts.baseUrl)
    }

    const redirectTo = new URL(opts.route, opts.baseUrl)
    const search = urlQueryToSearchParams(query)
    search.set("flow", useFlowId)
    redirectTo.search = search.toString()
    return redirectTo.toString()
  }

  if (!query["flow"]) {
    return { redirectTo: restartUrl(), restart: true }
  }

  try {
    const rawResponse = await fetchFlowRaw()
    // Clone the raw body before `value()` consumes it so we can recover
    // fields that the pinned `@ory/client-fetch` SDK strips during parsing.
    const rawClone =
      typeof rawResponse.raw?.clone === "function"
        ? rawResponse.raw.clone()
        : undefined
    const parsed = await rawResponse.value()
    if (rawClone) {
      try {
        reattachInputOptions(parsed, await rawClone.json())
      } catch (err) {
        // If the raw body is unavailable or not JSON, fall back to the
        // parsed flow as-is. Log so a broken backend response is still
        // visible in server logs during incident diagnosis.
        ;(opts.onRawResponseError ?? warnOnRawResponseError)(err)
      }
    }
    const flow = opts.transform ? opts.transform(parsed) : parsed
    return { flow: attachBaseUrl(flow, opts.baseUrl) }
  } catch (error) {
    const outcome: { redirect?: { redirectTo: string; restart: boolean } } = {}
    const errorHandlerOptions = {
      flowType,
      onValidationError,
      onRestartFlow: (useFlowId?: string) => {
        outcome.redirect = { redirectTo: restartUrl(useFlowId), restart: true }
      },
      onRedirect: (url: string) => {
        outcome.redirect = { redirectTo: url, restart: false }
      },
    }
    const flow = (await handleFlowError<T>(errorHandlerOptions)(error)) as
      | T
      | undefined
    if (outcome.redirect) {
      return outcome.redirect
    }
    return { flow: flow && attachBaseUrl(flow, opts.baseUrl) }
  }
}

/**
 * Options for {@link getFlow}.
 *
 * @public
 */
export type GetFlowOptions = {
  /**
   * The URL of the Ory project or Ory Kratos instance, for example
   * `https://<slug>.projects.oryapis.com`.
   */
  sdkUrl: string
  /**
   * The app's own page for this flow, for example `/login`.
   */
  route: string
  /**
   * The URL the browser uses to reach Ory, from {@link resolveOryBaseUrl}.
   */
  baseUrl: string
}

/**
 * Fetches the login, registration, recovery, verification, or settings flow
 * of a page request, forwarding the request's cookies to Ory.
 *
 * Without a `flow` query parameter, or when the flow is missing or expired,
 * it returns the URL to redirect the browser to. Ory URLs in the flow are
 * rewritten to `baseUrl`.
 *
 * @example
 * ```ts
 * const sdkUrl = "https://<slug>.projects.oryapis.com"
 * const { url: baseUrl } = resolveOryBaseUrl({
 *   sdkUrl,
 *   origin: requestOrigin(request),
 *   proxy: "absent",
 * })
 * const result = await getFlow<LoginFlow>(FlowType.Login, request, {
 *   sdkUrl,
 *   route: "/login",
 *   baseUrl,
 * })
 * if ("redirectTo" in result) {
 *   // Redirect the browser with your framework.
 * }
 * ```
 *
 * @param flowType - The type of the flow.
 * @param req - The page request.
 * @param opts - The Ory SDK URL, the app's route for the flow, and the browser URL.
 * @returns The flow, or the URL to redirect the browser to.
 * @public
 */
export async function getFlow<T extends object>(
  flowType: FlowType,
  req: OryRequest,
  opts: GetFlowOptions,
): Promise<FlowResult<T>> {
  const url = new URL(req.url)
  const sdkUrl = withoutTrailingSlash(opts.sdkUrl)
  const baseUrl = withoutTrailingSlash(opts.baseUrl)
  const id = url.searchParams.get("flow") ?? ""
  const params = { id, cookie: req.headers.get("cookie") ?? undefined }
  const client = frontendClient(sdkUrl)

  const fetchers: Partial<Record<FlowType, () => Promise<unknown>>> = {
    [FlowType.Login]: () => client.getLoginFlowRaw(params),
    [FlowType.Registration]: () => client.getRegistrationFlowRaw(params),
    [FlowType.Recovery]: () => client.getRecoveryFlowRaw(params),
    [FlowType.Verification]: () => client.getVerificationFlowRaw(params),
    [FlowType.Settings]: () => client.getSettingsFlowRaw(params),
  }
  const fetchFlowRaw = fetchers[flowType] as
    | (() => Promise<ApiResponse<T>>)
    | undefined
  if (!fetchFlowRaw) {
    throw new Error(
      `[@ory/ssr] Cannot fetch a flow of type "${flowType}". Use login, registration, recovery, verification, or settings.`,
    )
  }

  const result = await resolveFlow(
    flowType,
    searchParamsToQuery(url.searchParams),
    fetchFlowRaw,
    {
      baseUrl,
      route: new URL(opts.route, url).toString(),
      transform: (flow) =>
        rewriteJsonResponse(flow, { from: sdkUrl, to: baseUrl }),
    },
  )
  if ("redirectTo" in result) {
    return { redirectTo: result.redirectTo }
  }
  if (!result.flow) {
    throw new Error(
      `[@ory/ssr] No ${flowType} flow was returned for flow ID "${id}".`,
    )
  }
  return { flow: result.flow }
}
