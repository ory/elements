// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"
import { QueryParams } from "../types"
import { ParsedUrlQuery } from "querystring"

export async function getCookieHeader() {
  const h = await headers()
  return h.get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url) => {
  redirect(url)
}

/**
 * @internal
 */
export async function toGetFlowParameter(
  params: Promise<QueryParams> | QueryParams,
) {
  return {
    id: (await params)["flow"]?.toString() ?? "",
    cookie: await getCookieHeader(),
  }
}

export async function getPublicUrl() {
  const h = await headers()
  const host = h.get("host")
  const protocol = h.get("x-forwarded-proto") || "http"
  return `${protocol}://${host}`
}

/**
 * A utility type that represents the query parameters of a request.
 *
 * This is needed because Next.js does not expose the query parameters as a tye.
 *
 * ```ts
 * import { OryPageParams } from "@ory/nextjs/app"
 *
 * export default async function LoginPage(props: OryPageParams) {
 *   // props.searchParams is a Promise that resolves to an object with the query parameters
 * }
 * ```
 *
 * @public
 */
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

// Copied over from https://github.com/vercel/next.js/blob/dbd5e1b274d30f9107141475eba116a8118bc346/packages/next/src/shared/lib/router/utils/querystring.ts
// to avoid relying on internal APIs
function stringifyUrlQueryParam(param: unknown): string {
  if (typeof param === "string") {
    return param
  }

  if (
    (typeof param === "number" && !isNaN(param)) ||
    typeof param === "boolean"
  ) {
    return String(param)
  } else {
    return ""
  }
}

export function urlQueryToSearchParams(query: ParsedUrlQuery): URLSearchParams {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, stringifyUrlQueryParam(item))
      }
    } else {
      searchParams.set(key, stringifyUrlQueryParam(value))
    }
  }
  return searchParams
}
