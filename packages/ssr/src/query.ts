// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"

import type { QueryParams } from "./types"

export function searchParamsToQuery(searchParams: URLSearchParams) {
  const query: Record<string, string | string[]> = {}
  searchParams.forEach((value, key) => {
    const existing = query[key]
    query[key] =
      existing === undefined ? value : ([] as string[]).concat(existing, value)
  })
  return query
}

export function browserFlowUrl(
  params: QueryParams,
  flowType: FlowType,
  baseUrl: string,
) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return new URL(
    "/self-service/" +
      flowType.toString() +
      "/browser?" +
      urlQueryToSearchParams(params).toString(),
    baseUrl,
  ).toString()
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

export function urlQueryToSearchParams(query: QueryParams): URLSearchParams {
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
