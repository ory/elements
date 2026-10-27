// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryProxyState } from "@ory/ssr"

export const oryProxyHeader = "x-ory-proxy"

export const oryProxyHeaderValues = {
  trusted: "1",
  untrusted: "untrusted-origin",
} as const

export function protocolFromHeaders(
  h: Pick<Headers, "get">,
  fallbackProtocol = "http",
): string {
  return h.get("x-forwarded-proto") || fallbackProtocol
}

export function originFromHeaders(
  h: Pick<Headers, "get">,
  fallbackProtocol = "http",
): string {
  return `${protocolFromHeaders(h, fallbackProtocol)}://${h.get("host") ?? ""}`
}

export function proxyStateFromHeaders(h: Pick<Headers, "get">): OryProxyState {
  switch (h.get(oryProxyHeader)) {
    case oryProxyHeaderValues.trusted:
      return "trusted-origin"
    case oryProxyHeaderValues.untrusted:
      return "untrusted-origin"
    default:
      return "absent"
  }
}
