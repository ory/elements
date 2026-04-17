// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError, ApiResponse } from "@ory/client-fetch"

import { startNewFlow, onRedirect } from "./utils"
import { QueryParams } from "../types"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"

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

/**
 * A function that creates a flow fetcher. The flow fetcher can be used
 * to fetch a login, registration, recovery, settings, or verification flow
 * from the SDK.
 *
 * Unless you are building something very custom, you will not need this method. Use it with care and expect
 * potential breaking changes.
 *
 * @param params - The query parameters of the request.
 * @param fetchFlowRaw - A function that fetches the flow from the SDK.
 * @param flowType - The type of the flow.
 * @param baseUrl - The base URL of the application.
 * @param route - The route of the application.
 * @param options - Additional options.
 * @public
 */
export async function getFlowFactory<T extends object>(
  params: QueryParams,
  fetchFlowRaw: () => Promise<ApiResponse<T>>,
  flowType: FlowType,
  baseUrl: string,
  route: string,
  options: {
    disableRewrite?: boolean
  } = { disableRewrite: false },
): Promise<T | null | void> {
  // Guess our own public url using Next.js helpers. We need the hostname, port, and protocol.
  const onRestartFlow = (useFlowId?: string) => {
    if (!useFlowId) {
      return startNewFlow(params, flowType, baseUrl)
    }

    const redirectTo = new URL(route, baseUrl)
    redirectTo.search = new URLSearchParams({
      ...params,
      flow: useFlowId,
    }).toString()
    return redirect(redirectTo.toString(), RedirectType.replace)
  }

  if (!params["flow"]) {
    return onRestartFlow()
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
        // eslint-disable-next-line no-console
        console.warn(
          "reattachInputOptions: failed to read raw flow response; enum options on input nodes may be missing",
          err,
        )
      }
    }
    return options.disableRewrite
      ? parsed
      : rewriteJsonResponse(parsed, baseUrl)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })

    return await errorHandler(error)
  }
}
