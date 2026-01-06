// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { parse as parseCookie, splitCookiesString } from "set-cookie-parser"
import psl from "psl"

interface CookieProcessorOptions {
  forceCookieDomain?: string
}

/**
 * Process set-cookie headers to fix domain for proxied requests
 */
export function processSetCookieHeaders(
  protocol: string,
  response: Response,
  options: CookieProcessorOptions,
  requestHeaders: Headers,
): string[] {
  const setCookie = response.headers.get("set-cookie")
  if (!setCookie) {
    return []
  }

  const cookies = splitCookiesString(setCookie)
  const processed: string[] = []

  for (const cookie of cookies) {
    const parsed = parseCookie(cookie, { decodeValues: false })
    if (!parsed.length) continue

    const c = parsed[0]
    let domain = options.forceCookieDomain

    if (!domain) {
      // Try to get domain from request host
      const host = requestHeaders.get("host")
      if (host) {
        const hostWithoutPort = host.split(":")[0]
        const parsedDomain = psl.parse(hostWithoutPort)
        if (parsedDomain && "domain" in parsedDomain && parsedDomain.domain) {
          domain = parsedDomain.domain
        }
      }
    }

    // Build cookie string
    let cookieStr = `${c.name}=${c.value}`

    if (domain) {
      cookieStr += `; Domain=${domain}`
    }
    if (c.path) {
      cookieStr += `; Path=${c.path}`
    }
    if (c.expires) {
      cookieStr += `; Expires=${c.expires.toUTCString()}`
    }
    if (c.maxAge) {
      cookieStr += `; Max-Age=${c.maxAge}`
    }
    if (c.httpOnly) {
      cookieStr += `; HttpOnly`
    }
    if (c.secure || protocol === "https:") {
      cookieStr += `; Secure`
    }
    if (c.sameSite) {
      cookieStr += `; SameSite=${c.sameSite}`
    }

    processed.push(cookieStr)
  }

  return processed
}
