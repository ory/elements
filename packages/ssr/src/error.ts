// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError } from "@ory/client-fetch"

import { attachBaseUrl } from "./base-url"
import { frontendClient } from "./client"
import { searchParamsToQuery } from "./query"
import type { OryRequest, QueryParams } from "./types"

/**
 * Resolves the error of an error page from its query parameters, with a
 * caller-provided function that fetches a flow error from Ory.
 *
 * Use {@link getError} unless you need to control how the error is fetched.
 *
 * @param query - The query parameters of the error page request.
 * @param fetchFlowError - Fetches the flow error with the ID from the `id` query parameter.
 * @param opts - The URL the browser uses to reach Ory, from {@link resolveOryBaseUrl}. It is attached to the result as `ory_base_url`.
 * @returns An object containing the error and error description, or a FlowError object if the error is a flow error. If the error is not a flow error, the error description will be "An unknown error occurred.".
 * @public
 */
export async function resolveError(
  query: QueryParams,
  fetchFlowError: (params: { id: string }) => Promise<FlowError>,
  opts: { baseUrl: string },
): Promise<{ error: string; error_description: string } | FlowError> {
  return attachBaseUrl(await fetchError(query, fetchFlowError), opts.baseUrl)
}

async function fetchError(
  query: QueryParams,
  fetchFlowError: (params: { id: string }) => Promise<FlowError>,
): Promise<{ error: string; error_description: string } | FlowError> {
  if ("error" in query) {
    return {
      error: query["error"] as string,
      error_description:
        (query["error_description"] as string | undefined) ??
        "An unknown error occurred.",
    }
  }

  const id = query["id"]?.toString() ?? ""
  if (!id) {
    return {
      error: "unknown_error",
      error_description: "An unknown error occurred.",
    }
  }

  try {
    return await fetchFlowError({ id })
  } catch (error) {
    return {
      error: "unknown_error",
      error_description:
        error instanceof Error ? error.message : "An unknown error occurred.",
    }
  }
}

/**
 * Fetches the error shown on an error page. The error comes from the `error`
 * and `error_description` query parameters, or from Ory for the flow error in
 * the `id` query parameter.
 *
 * @param req - The error page request.
 * @param opts - The Ory SDK URL, and the URL the browser uses to reach Ory. The latter is attached to the result as `ory_base_url`.
 * @returns An object containing the error and error description, or a FlowError object if the error is a flow error. If the error is not a flow error, the error description will be "An unknown error occurred.".
 * @public
 */
export async function getError(
  req: OryRequest,
  opts: { sdkUrl: string; baseUrl: string },
): Promise<{ error: string; error_description: string } | FlowError> {
  return resolveError(
    searchParamsToQuery(new URL(req.url).searchParams),
    (p) => frontendClient(opts.sdkUrl).getFlowError(p),
    { baseUrl: opts.baseUrl },
  )
}
