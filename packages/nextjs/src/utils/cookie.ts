// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryConfig } from "../types"
import { parse } from "psl"

export function guessCookieDomain(url: string | undefined, config: OryConfig) {
  if (!url || config.forceCookieDomain) {
    return config.forceCookieDomain
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url).hostname
  } catch (e) {
    parsedUrl = url
  }

  const parsed = parse(parsedUrl)

  if (parsed.error) {
    return undefined
  }

  if (isIPAddress(parsedUrl)) {
    return parsedUrl
  }

  return parsed.domain || parsed.input
}

// Helper function to check if the hostname is an IP address
export function isIPAddress(hostname: string) {
  // IPv4 pattern: four groups of 1-3 digits, separated by dots, each between 0-255
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/

  // IPv6 pattern: eight groups of 1-4 hexadecimal digits, separated by colons, optional shorthand (::)
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/

  return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname)
}
