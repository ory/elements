// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { isSameSite } from "@ory/ssr"
import { useRouter } from "next/router"

export function onValidationError<T>(value: T): T {
  return value
}

/**
 * The browser cannot see whether the middleware handled the page, so the
 * Pages Router uses the page's origin unless Ory is on the same site.
 */
export function browserOryUrl(): string {
  const origin = window.location.origin
  const sdkUrl = process.env["NEXT_PUBLIC_ORY_SDK_URL"]?.replace(/\/$/, "")
  return sdkUrl && isSameSite(origin, sdkUrl) ? sdkUrl : origin
}

export const toBrowserEndpointRedirect = (
  params: URLSearchParams,
  flowType: FlowType,
) =>
  browserOryUrl() +
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
