// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError } from "@ory/client-fetch"

import { init, onRedirect } from "./utils"
import { QueryParams } from "../types"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"
import * as runtime from "@ory/client-fetch/src/runtime"

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
