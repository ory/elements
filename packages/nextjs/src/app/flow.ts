// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use server"
import { FlowType, handleFlowError, ApiResponse } from "@ory/client-fetch"
import { FlowParams, initOverrides, QueryParams } from "../types"
import { onValidationError, toValue } from "../utils"

export function getFlowFactory<T>(factory: {
  redirectToBrowserEndpoint: (params: QueryParams, flowType: FlowType) => void
  onRedirect: (url: string, external: boolean) => void
  toFlowParams: (params: QueryParams) => FlowParams
  flowType: FlowType
  fetchFlow: (
    params: FlowParams,
    initOverrides: RequestInit,
  ) => Promise<ApiResponse<T>>
}): (params: QueryParams) => Promise<T | null | void> {
  return async (params: QueryParams) => {
    const onRestartFlow = () =>
      factory.redirectToBrowserEndpoint(params, factory.flowType)

    if (!params["flow"]) {
      onRestartFlow()
      return
    }

    try {
      const resp = await factory.fetchFlow(
        factory.toFlowParams(params),
        initOverrides,
      )

      return toValue<T>(resp)
    } catch (error) {
      const errorHandler = handleFlowError({
        onValidationError,
        onRestartFlow,
        onRedirect: factory.onRedirect,
      })
      await errorHandler(error)
      return null
    }
  }
}
