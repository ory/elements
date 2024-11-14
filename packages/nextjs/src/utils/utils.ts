// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { parse, splitCookiesString } from "set-cookie-parser"
import { serialize, SerializeOptions } from "cookie"

import { FlowParams, OryConfig, QueryParams } from "../types"
import { guessCookieDomain } from "./cookie"
import { defaultForwardedHeaders } from "./headers"

export function onValidationError<T>(value: T): T {
  return value
}

export async function toFlowParams(
  params: QueryParams,
  getCookieHeader: () => Promise<string | undefined>,
): Promise<FlowParams> {
  return {
    id: params["flow"],
    cookie: await getCookieHeader(),
    return_to: params["return_to"],
  }
}
export function processSetCookieHeaders(
  protocol: string,
  fetchResponse: Response,
  options: OryConfig,
  requestHeaders: Headers,
) {
  const isTls =
    protocol === "https:" || requestHeaders.get("x-forwarded-proto") === "https"

  const forwarded = requestHeaders.get("x-forwarded-host")
  const host = forwarded ? forwarded : requestHeaders.get("host")
  const domain = guessCookieDomain(host ?? "", options)

  return parse(
    splitCookiesString(fetchResponse.headers.get("set-cookie") || ""),
  )
    .map((cookie) => ({
      ...cookie,
      domain,
      secure: isTls,
      encode: (v: string) => v,
    }))
    .map(({ value, name, ...options }) =>
      serialize(name, value, options as SerializeOptions),
    )
}

export function filterRequestHeaders(
  headers: Headers,
  forwardAdditionalHeaders?: string[],
): Headers {
  const filteredHeaders = new Headers()

  headers.forEach((value, key) => {
    const isValid =
      defaultForwardedHeaders.includes(key) ||
      (forwardAdditionalHeaders ?? []).includes(key)
    if (isValid) filteredHeaders.set(key, value)
  })

  return filteredHeaders
}

export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  const base = new URL(baseUrl)
  const relative = new URL(relativeUrl, baseUrl)

  relative.pathname =
    base.pathname.replace(/\/$/, "") +
    "/" +
    relative.pathname.replace(/^\//, "")

  return new URL(relative.toString(), baseUrl).href
}
