import { headers } from "next/headers"
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { redirect, RedirectType } from "next/navigation"
import { QueryParams } from "@/nextjs/types"
import {
  toBrowserEndpointRedirect,
  toFlowParams as baseToFlowParams,
} from "@/nextjs/utils"

export function getCookieHeader() {
  return headers().get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url, external) => {
  redirect(url)
}

export function toFlowParams(params: QueryParams) {
  return baseToFlowParams(params, getCookieHeader)
}

export function redirectToBrowserEndpoint(
  params: QueryParams,
  flowType: FlowType,
) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return redirect(
    toBrowserEndpointRedirect(params, flowType),
    RedirectType.replace,
  )
}
