// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError } from "@ory/client-fetch"

import { init, onRedirect } from "./utils"
import { QueryParams } from "../types"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"
import * as runtime from "@ory/client-fetch/src/runtime"

/**
 * A function that creates a flow fetcher. The flow fetcher can be used
 * to fetch a login, registration, recovery, settings, or verification flow
 * from the SDK.
 *
 * Unless you are building something very custom, you will not need this method. Use it with care and expect
 * potential breaking changes.
 *
 * @param params
 * @param fetchFlowRaw
 * @param flowType
 * @param baseUrl
 * @param route
 */
export async function getFlowFactory<T extends object>(
  params: QueryParams,
  fetchFlowRaw: () => Promise<runtime.ApiResponse<T>>,
  flowType: FlowType,
  baseUrl: string,
  route: string,
): Promise<T | null | void> {
  // Guess our own public url using Next.js helpers. We need the hostname, port, and protocol.

  const onRestartFlow = (useFlowId?: string) => {
    if (!useFlowId) {
      return init(params, flowType, baseUrl)
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
      .then((v: T): T => rewriteJsonResponse(v, baseUrl))
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })

    return await errorHandler(error)
  }
}
