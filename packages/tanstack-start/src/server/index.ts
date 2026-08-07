// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/only-throw-error -- TanStack Router implements redirects by throwing Response objects. */

import {
  type ApiResponse,
  Configuration,
  FlowType,
  FrontendApi,
  handleFlowError,
  isResponseError,
  type LoginFlow,
  type RecoveryFlow,
  type RegistrationFlow,
  type SettingsFlow,
  type VerificationFlow,
} from "@ory/client-fetch"
import { redirect } from "@tanstack/react-router"
import { get } from "psl"
import type {
  FlowRequest,
  OryServer,
  OryTanStackStartOptions,
  QueryParams,
} from "../types"
import { rewriteJsonResponse } from "../utils/rewrite"

function urlQueryToSearchParams(query: QueryParams): URLSearchParams {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item))
    } else if (value !== undefined) {
      searchParams.set(key, value)
    }
  }
  return searchParams
}

function isSameSite(originA: string, originB: string): boolean {
  const urlA = new URL(originA)
  const urlB = new URL(originB)
  if (urlA.protocol !== urlB.protocol) return false

  const hostA = urlA.hostname
  const hostB = urlB.hostname
  if (hostA === hostB) return true

  const domainA = get(hostA)
  const domainB = get(hostB)
  return Boolean(domainA && domainB && domainA === domainB)
}

function browserSdkUrl(
  options: OryTanStackStartOptions,
  request: Request,
): string {
  const appOrigin = new URL(options.appUrl ?? request.url).origin
  return isSameSite(appOrigin, options.sdkUrl) ? options.sdkUrl : appOrigin
}

function appOrigin(options: OryTanStackStartOptions, request: Request): string {
  return new URL(options.appUrl ?? request.url).origin
}

function startNewFlow(
  options: OryTanStackStartOptions,
  request: Request,
  params: QueryParams,
  flowType: FlowType,
): never {
  const target = new URL(
    `/self-service/${flowType}/browser`,
    browserSdkUrl(options, request),
  )
  target.search = urlQueryToSearchParams(params).toString()
  throw redirect({
    href: target.toString(),
    replace: true,
    statusCode: 303,
  })
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function rewriteForBrowser<T>(
  value: T,
  options: OryTanStackStartOptions,
  request: Request,
): T {
  const browserUrl = browserSdkUrl(options, request)
  const publicUrls = new Set([
    options.serverSdkUrl ?? options.sdkUrl,
    options.sdkUrl,
  ])
  let rewritten = value
  for (const sourceUrl of publicUrls) {
    rewritten = rewriteJsonResponse(rewritten, sourceUrl, browserUrl)
  }
  return rewritten
}

function reattachInputOptions<T>(parsed: T, rawJson: unknown): void {
  const raw = rawJson as {
    ui?: {
      nodes?: Array<{
        attributes?: { name?: unknown; options?: unknown }
      }>
    }
  }
  const parsedFlow = parsed as {
    ui?: {
      nodes?: Array<{
        attributes?: { name?: unknown } & Record<string, unknown>
      }>
    }
  }
  const rawNodes = raw.ui?.nodes
  const parsedNodes = parsedFlow.ui?.nodes
  if (!Array.isArray(rawNodes) || !Array.isArray(parsedNodes)) return

  const rawOptionsByName = new Map<string, unknown[]>()
  for (const node of rawNodes) {
    const name = node.attributes?.name
    const nodeOptions = node.attributes?.options
    if (
      typeof name === "string" &&
      Array.isArray(nodeOptions) &&
      nodeOptions.length > 0 &&
      nodeOptions.every(
        (option) => typeof option === "object" && option !== null,
      )
    ) {
      rawOptionsByName.set(name, nodeOptions)
    }
  }

  for (const node of parsedNodes) {
    const attributes = node.attributes
    if (!attributes || typeof attributes.name !== "string") continue
    const nodeOptions = rawOptionsByName.get(attributes.name)
    if (nodeOptions) attributes["options"] = nodeOptions
  }
}

async function getFlow<T extends object>(args: {
  options: OryTanStackStartOptions
  request: Request
  params: QueryParams
  flowType: FlowType
  uiRoute: string
  fetchFlowRaw: () => Promise<ApiResponse<T>>
}): Promise<T> {
  const { options, request, params, flowType, uiRoute, fetchFlowRaw } = args
  const onRestartFlow = (flowId?: string): never => {
    if (!flowId) {
      return startNewFlow(options, request, params, flowType)
    }

    const target = new URL(uiRoute, appOrigin(options, request))
    target.search = urlQueryToSearchParams({
      ...params,
      flow: flowId,
    }).toString()
    throw redirect({
      href: target.toString(),
      replace: true,
      statusCode: 303,
    })
  }

  if (!firstParam(params["flow"])) {
    return onRestartFlow()
  }

  try {
    const response = await fetchFlowRaw()
    const rawResponse =
      typeof response.raw?.clone === "function"
        ? response.raw.clone()
        : undefined
    const parsed = await response.value()
    if (rawResponse) {
      try {
        reattachInputOptions(parsed, await rawResponse.json())
      } catch (error) {
        // The parsed flow remains usable if the cloned response body is not JSON.
        console.warn(
          "Unable to recover enum options from the raw Ory flow response",
          error,
        )
      }
    }
    return rewriteForBrowser(parsed, options, request)
  } catch (error) {
    const handled = await handleFlowError<T>({
      onValidationError: <V>(value: V) => value,
      onRestartFlow,
      onRedirect: (url) => {
        throw redirect({ href: url, statusCode: 303 })
      },
    })(error)
    if (handled) return handled
    throw new Error(`The ${flowType} flow ended without a result`)
  }
}

function requiredRoute(route: string | undefined, flowType: FlowType): string {
  if (!route) {
    throw new Error(`Missing project route for the ${flowType} flow`)
  }
  return route
}

/**
 * Creates request-aware Ory server helpers for TanStack Start.
 *
 * @public
 */
export function createOry(options: OryTanStackStartOptions): OryServer {
  const normalizedOptions = {
    ...options,
    sdkUrl: options.sdkUrl.replace(/\/$/, ""),
    serverSdkUrl: (options.serverSdkUrl ?? options.sdkUrl).replace(/\/$/, ""),
  }
  const frontend = new FrontendApi(
    new Configuration({
      basePath: normalizedOptions.serverSdkUrl,
      fetchApi: normalizedOptions.fetchApi,
      headers: { Accept: "application/json" },
    }),
  )

  return {
    getBrowserSdkUrl({ request }: { request: Request }) {
      return browserSdkUrl(normalizedOptions, request)
    },
    getLoginFlow({ request, params }: FlowRequest) {
      return getFlow<LoginFlow>({
        options: normalizedOptions,
        request,
        params,
        flowType: FlowType.Login,
        uiRoute: requiredRoute(
          normalizedOptions.project.login_ui_url,
          FlowType.Login,
        ),
        fetchFlowRaw: () =>
          frontend.getLoginFlowRaw(
            {
              id: firstParam(params["flow"]),
              cookie: request.headers.get("cookie") ?? undefined,
            },
            { cache: "no-cache" },
          ),
      })
    },
    getRegistrationFlow({ request, params }: FlowRequest) {
      return getFlow<RegistrationFlow>({
        options: normalizedOptions,
        request,
        params,
        flowType: FlowType.Registration,
        uiRoute: requiredRoute(
          normalizedOptions.project.registration_ui_url,
          FlowType.Registration,
        ),
        fetchFlowRaw: () =>
          frontend.getRegistrationFlowRaw(
            {
              id: firstParam(params["flow"]),
              cookie: request.headers.get("cookie") ?? undefined,
            },
            { cache: "no-cache" },
          ),
      })
    },
    getRecoveryFlow({ request, params }: FlowRequest) {
      return getFlow<RecoveryFlow>({
        options: normalizedOptions,
        request,
        params,
        flowType: FlowType.Recovery,
        uiRoute: requiredRoute(
          normalizedOptions.project.recovery_ui_url,
          FlowType.Recovery,
        ),
        fetchFlowRaw: () =>
          frontend.getRecoveryFlowRaw(
            {
              id: firstParam(params["flow"]),
              cookie: request.headers.get("cookie") ?? undefined,
            },
            { cache: "no-cache" },
          ),
      })
    },
    getVerificationFlow({ request, params }: FlowRequest) {
      return getFlow<VerificationFlow>({
        options: normalizedOptions,
        request,
        params,
        flowType: FlowType.Verification,
        uiRoute: requiredRoute(
          normalizedOptions.project.verification_ui_url,
          FlowType.Verification,
        ),
        fetchFlowRaw: () =>
          frontend.getVerificationFlowRaw(
            {
              id: firstParam(params["flow"]),
              cookie: request.headers.get("cookie") ?? undefined,
            },
            { cache: "no-cache" },
          ),
      })
    },
    getSettingsFlow({ request, params }: FlowRequest) {
      return getFlow<SettingsFlow>({
        options: normalizedOptions,
        request,
        params,
        flowType: FlowType.Settings,
        uiRoute: requiredRoute(
          normalizedOptions.project.settings_ui_url,
          FlowType.Settings,
        ),
        fetchFlowRaw: () =>
          frontend.getSettingsFlowRaw(
            {
              id: firstParam(params["flow"]),
              cookie: request.headers.get("cookie") ?? undefined,
            },
            { cache: "no-cache" },
          ),
      })
    },
    getSession({ request }: { request: Request }) {
      return frontend
        .toSession({
          cookie: request.headers.get("cookie") ?? undefined,
        })
        .catch((error: unknown) => {
          if (isResponseError(error) && error.response.status === 401) {
            return null
          }
          throw error
        })
    },
    async getError({ params }: { params: QueryParams }) {
      const error = firstParam(params["error"])
      if (error) {
        return {
          error,
          error_description:
            firstParam(params["error_description"]) ||
            "An unknown error occurred.",
        }
      }
      const id = firstParam(params["id"])
      if (!id) {
        return {
          error: "unknown_error",
          error_description: "An unknown error occurred.",
        }
      }
      try {
        return await frontend.getFlowError({ id })
      } catch (cause) {
        return {
          error: "unknown_error",
          error_description:
            cause instanceof Error
              ? cause.message
              : "An unknown error occurred.",
        }
      }
    },
    async getLogoutFlow({
      request,
      returnTo,
    }: {
      request: Request
      returnTo?: string
    }) {
      const flow = await frontend.createBrowserLogoutFlow({
        cookie: request.headers.get("cookie") ?? undefined,
        returnTo,
      })
      return rewriteForBrowser(flow, normalizedOptions, request)
    },
  }
}

export type {
  FlowRequest,
  OryFlowError,
  OryServer,
  OryTanStackStartOptions,
  QueryParams,
} from "../types"
