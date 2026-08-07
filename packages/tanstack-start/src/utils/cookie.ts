// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { type SetCookie, stringifySetCookie } from "cookie"
import { errorCodes, type ErrorResult, parse as parseDomain } from "psl"
import { parseSetCookie } from "set-cookie-parser"

function isErrorResult(
  result: unknown,
): result is ErrorResult<keyof typeof errorCodes> {
  return (
    result !== null &&
    typeof result === "object" &&
    "error" in result &&
    "input" in result
  )
}

function isIpAddress(hostname: string): boolean {
  const ipv4 =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/
  const ipv6 = hostname.includes(":") && /^[0-9a-f:[\]]+$/i.test(hostname)
  return ipv4.test(hostname) || ipv6
}

export function guessCookieDomain(urlOrHost: string): string | undefined {
  let hostname: string
  try {
    hostname = new URL(urlOrHost).hostname
  } catch {
    if (urlOrHost.includes("://")) return undefined
    try {
      hostname = new URL(`http://${urlOrHost}`).hostname
    } catch {
      return undefined
    }
  }

  if (isIpAddress(hostname)) return hostname.replace(/^\[|\]$/g, "")

  const parsed = parseDomain(hostname)
  if (isErrorResult(parsed)) return undefined
  const domain: string = parsed.domain ?? parsed.input
  return domain
}

export function rewriteSetCookieHeaders(args: {
  response: Response
  appUrl: string
  forceCookieDomain?: string
}): string[] {
  const { response, appUrl, forceCookieDomain } = args
  const url = new URL(appUrl)
  const domain = forceCookieDomain ?? guessCookieDomain(url.hostname)
  const secure = url.protocol === "https:"

  return parseSetCookie(response.headers.get("set-cookie") ?? "", {
    split: true,
  }).map(({ name, value, ...cookieOptions }) =>
    stringifySetCookie(
      {
        ...cookieOptions,
        name,
        value,
        domain,
        secure,
      } as SetCookie,
      { encode: (item: string) => item },
    ),
  )
}
