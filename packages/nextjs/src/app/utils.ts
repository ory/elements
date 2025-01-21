// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

import { urlQueryToSearchParams } from "next/dist/shared/lib/router/utils/querystring"
import { QueryParams } from "../types"

export async function getCookieHeader() {
  // eslint-disable-next-line @typescript-eslint/await-thenable -- types in the next SDK are wrong?
  const h = await headers()
  return h.get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url) => {
  redirect(url)
}

export async function toGetFlowParameter(
  params: Promise<QueryParams> | QueryParams,
) {
  return {
    id: (await params)["flow"]?.toString() ?? "",
    cookie: await getCookieHeader(),
  }
}

export async function getPublicUrl() {
  // eslint-disable-next-line @typescript-eslint/await-thenable -- types in the next SDK are wrong?
  const h = await headers()
  const host = h.get("host")
  const protocol = h.get("x-forwarded-proto") || "http"
  return `${protocol}://${host}`
}

export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export function startNewFlow(
  params: QueryParams,
  flowType: FlowType,
  baseUrl: string,
) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return redirect(
    new URL(
      "/self-service/" +
        flowType.toString() +
        "/browser?" +
        urlQueryToSearchParams(params).toString(),
      baseUrl,
    ).toString(),
    RedirectType.replace,
  )
}
