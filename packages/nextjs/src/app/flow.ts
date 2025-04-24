// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError, ApiResponse } from "@ory/client-fetch"

import { startNewFlow, onRedirect } from "./utils"
import { QueryParams } from "../types"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"

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
    return await rawResponse
      .value()
      .then(
        (v: T): T =>
          options.disableRewrite ? v : rewriteJsonResponse(v, baseUrl),
      )
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })

    return await errorHandler(error)
  }
}
