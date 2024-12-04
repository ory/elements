// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { useRouter } from "next/router"

export function onValidationError<T>(value: T): T {
  return value
}

export const toBrowserEndpointRedirect = (
  params: URLSearchParams,
  flowType: FlowType,
) =>
  guessPotentiallyProxiedOrySdkUrl({
    knownProxiedUrl: window.location.origin,
  }) +
  "/self-service/" +
  flowType.toString() +
  "/browser?" +
  new URLSearchParams(params).toString()

export const handleRestartFlow =
  (searchParams: URLSearchParams, flowType: FlowType) => () => {
    window.location.assign(toBrowserEndpointRedirect(searchParams, flowType))
  }

export function useOnRedirect(): OnRedirectHandler {
  const router = useRouter()
  return (url: string, external: boolean) => {
    if (external) {
      window.location.assign(url)
    } else {
      void router.push(url)
    }
  }
}
