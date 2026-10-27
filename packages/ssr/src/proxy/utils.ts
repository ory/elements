// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { serialize, SerializeOptions } from "cookie"
import { parse, splitCookiesString } from "set-cookie-parser"

import { guessCookieDomain } from "./cookie"
import { defaultForwardedHeaders } from "./headers"
import type { OryProxyOptions } from "./proxy"

/**
 * Rewrites the `Set-Cookie` headers of an Ory response so the browser stores
 * the cookies for the app's domain instead of Ory's.
 *
 * @param protocol - The protocol of the incoming request, for example `https:`.
 * @param fetchResponse - The response from Ory.
 * @param options - The proxy options.
 * @param requestHeaders - The headers of the incoming request.
 * @returns The rewritten `Set-Cookie` header values.
 * @internal
 */
export function processSetCookieHeaders(
  protocol: string,
  fetchResponse: Response,
  options: Pick<OryProxyOptions, "forceCookieDomain">,
  requestHeaders: Headers,
) {
  const isTls =
    protocol === "https:" || requestHeaders.get("x-forwarded-proto") === "https"

  const forwarded = requestHeaders.get("x-forwarded-host")
  const host = forwarded ? forwarded : requestHeaders.get("host")
  const domain =
    host && !options.forceCookieDomain
      ? guessCookieDomain(host ?? "")
      : options.forceCookieDomain

  return parse(
    splitCookiesString(fetchResponse.headers.get("set-cookie") || ""),
  )
    .map((cookie) =>
      // Browsers reject a __Host- cookie that has a Domain attribute or lacks
      // Secure (RFC 6265bis, section 4.1.3.2), so it is forwarded unchanged.
      cookie.name.startsWith("__Host-")
        ? { ...cookie, encode: (v: string) => v }
        : { ...cookie, domain, secure: isTls, encode: (v: string) => v },
    )
    .map(({ value, name, ...options }) =>
      serialize(name, value, options as SerializeOptions),
    )
}

/**
 * Keeps only the request headers that are forwarded to Ory.
 *
 * @param headers - The headers of the incoming request.
 * @param forwardAdditionalHeaders - Headers to forward in addition to the default list.
 * @returns The headers to send to Ory.
 * @internal
 */
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

/**
 * Appends the path of `relativeUrl` to the path of `baseUrl`.
 *
 * @param baseUrl - The base URL.
 * @param relativeUrl - The URL or path to append.
 * @returns The joined URL.
 * @internal
 */
export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  const base = new URL(baseUrl)
  const relative = new URL(relativeUrl, baseUrl)

  relative.pathname =
    base.pathname.replace(/\/$/, "") +
    "/" +
    relative.pathname.replace(/^\//, "")

  return new URL(relative.toString(), baseUrl).href
}
