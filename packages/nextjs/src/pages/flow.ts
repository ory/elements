// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, handleFlowError } from "@ory/client-fetch"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import { handleRestartFlow, onValidationError, useOnRedirect } from "./utils"
import { toValue } from "../utils/utils"
import * as runtime from "@ory/client-fetch/src/runtime"

interface Flow {
  id: string
}

export function createUseFlowFactory<T extends Flow>(
  flowType: FlowType,
  createFlow: (params: URLSearchParams) => Promise<runtime.ApiResponse<T>>,
  getFlow: (id: string) => Promise<runtime.ApiResponse<T>>,
): () => T | null | void {
  return () => {
    const [flow, setFlow] = useState<T>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const onRestartFlow = handleRestartFlow(searchParams, flowType)
    const onRedirect = useOnRedirect()

    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect,
    })

    const handleSetFlow = async (flow: T) => {
      setFlow(flow)

      // Use the router to update the `flow` search parameter only
      await router.replace({
        query: { flow: flow.id },
      })
      return
    }

    useEffect(() => {
      const id = searchParams.get("flow")

      // If the router is not ready yet, or we already have a flow, do nothing.
      if (!router.isReady || flow !== undefined) {
        return
      }

      if (!id) {
        createFlow(searchParams)
          .then(toValue)
          .then(handleSetFlow)
          .catch(errorHandler)
        return
      }

      getFlow(id).then(toValue).then(handleSetFlow).catch(errorHandler)
    }, [searchParams, router, router.isReady, flow])

    return flow
  }
}
