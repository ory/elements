// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError } from "@ory/client-fetch"

import { getPublicUrl, onRedirect } from "./utils"
import { QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"
import * as runtime from "@ory/client-fetch/src/runtime"

export async function getFlow<T extends object>(
  params: QueryParams,
  fetchFlowRaw: () => Promise<runtime.ApiResponse<T>>,
  flowType: FlowType,
): Promise<T | null | void> {
  // Guess our own public url using Next.js helpers. We need the hostname, port, and protocol.
  const knownProxiedUrl = await getPublicUrl()
  const url = guessPotentiallyProxiedOrySdkUrl({
    knownProxiedUrl,
  })

  const onRestartFlow = () => {
    const redirectTo = new URL(
      "/self-service/" + flowType.toString() + "/browser",
      url,
    )
    redirectTo.search = new URLSearchParams(params).toString()
    return redirect(redirectTo.toString(), RedirectType.replace)
  }

  if (!params["flow"]) {
    onRestartFlow()
    return
  }

  try {
    const rawResponse = await fetchFlowRaw()
    return await rawResponse
      .value()
      .then((v: T): T => rewriteJsonResponse(v, url))
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })
    await errorHandler(error)
    return null
  }
}
