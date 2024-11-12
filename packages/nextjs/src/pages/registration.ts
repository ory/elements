// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { useEffect, useState } from "react"
import {
  FlowType,
  handleFlowError,
  OnRedirectHandler,
  RegistrationFlow,
  ApiResponse,
} from "@ory/client-fetch"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import { clientSideFrontendClient } from "./client"
import { rewriteJsonResponse } from "../utils/rewrite"

export function toValue<T extends object>(res: ApiResponse<T>): Promise<T> {
  // Remove all undefined values from the response (array and object) using lodash:
  // Remove all (nested) undefined values from the response using lodash
  return res.value().then((v) => rewriteJsonResponse(v))
}

export function onValidationError<T>(value: T): T {
  return value
}

const toBrowserEndpointRedirect = (
  params: URLSearchParams,
  flowType: FlowType,
) =>
  "http://localhost:3000" +
  "/self-service/" +
  flowType.toString() +
  "/browser?" +
  new URLSearchParams(params).toString()

const handleRestartFlow =
  (searchParams: URLSearchParams, flowType: FlowType) => () => {
    window.location.assign(toBrowserEndpointRedirect(searchParams, flowType))
  }

function useOnRedirect(): OnRedirectHandler {
  const router = useRouter()
  return (url: string, external: boolean) => {
    if (external) {
      window.location.assign(url)
    } else {
      router.push(url)
    }
  }
}

export function useRegistrationFlow(): RegistrationFlow | null | void {
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const onRestartFlow = handleRestartFlow(searchParams, FlowType.Registration)
  const onRedirect = useOnRedirect()

  const errorHandler = handleFlowError({
    onValidationError,
    onRestartFlow,
    onRedirect,
  })

  const handleSetFlow = (flow: RegistrationFlow) => {
    setFlow(flow)

    // Use the router to update the `flow` search parameter only
    return router.replace({
      query: { flow: flow.id },
    })
  }

  useEffect(() => {
    const id = searchParams.get("flow")

    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow !== undefined) {
      return
    }

    if (!id) {
      clientSideFrontendClient
        .createBrowserRegistrationFlowRaw({
          returnTo: searchParams.get("return_to") ?? undefined,
          loginChallenge: searchParams.get("login_challenge") ?? undefined,
          afterVerificationReturnTo:
            searchParams.get("after_verification_return_to") ?? undefined,
          organization: searchParams.get("organization") ?? undefined,
        })
        .then(toValue)
        .then(handleSetFlow)
        .catch(errorHandler)
      return
    }

    clientSideFrontendClient
      .getRegistrationFlowRaw({ id })
      .then(toValue)
      .then(handleSetFlow)
      .catch(errorHandler)
  }, [searchParams, router, router.isReady, flow])

  return flow
}
