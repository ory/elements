// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

import { QueryParams } from "../types"
import { toFlowParams as baseToFlowParams } from "../utils/utils"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"

export async function getCookieHeader() {
  const h = await headers()
  return h.get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url, external) => {
  redirect(url)
}

export async function toFlowParams(params: QueryParams) {
  return baseToFlowParams(params, getCookieHeader)
}

export function redirectToBrowserEndpoint(
  params: QueryParams,
  flowType: FlowType,
) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return redirect(
    new URL(
      "/self-service/" + flowType.toString() + "/browser?" + params.toString(),
      guessPotentiallyProxiedOrySdkUrl(),
    ).toString(),
    RedirectType.replace,
  )
}

export async function getPublicUrl() {
  const h = await headers()
  const host = h.get("host")
  const protocol = h.get("x-forwarded-proto") || "http"
  return `${protocol}://${host}`
}
