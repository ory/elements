// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { useRouter } from "next/router"
import type { ParsedUrlQuery } from "querystring"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"

export const handleRestartFlow =
  (searchParams: URLSearchParams, flowType: FlowType) => () => {
    window.location.assign(
      new URL(
        "/self-service/" +
          flowType.toString() +
          "/browser?" +
          searchParams.toString(),
        guessPotentiallyProxiedOrySdkUrl(),
      ).toString(),
    )
  }

export function useOnRedirect(): OnRedirectHandler {
  const router = useRouter()
  return (url: string, external: boolean) => {
    if (external) {
      window.location.assign(url)
    } else {
      router.push(url)
    }
  }
}

export function toSearchParams(query: ParsedUrlQuery) {
  // Convert ParsedUrlQuery to URLSearchParams
  const searchParams = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (!value) {
      return
    }

    // Handle array
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v))
      return
    }
    searchParams.set(key, value)
  })

  return searchParams
}

export function useSearchParams() {
  const router = useRouter()
  return toSearchParams(router.query)
}
