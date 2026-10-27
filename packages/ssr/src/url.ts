// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { get } from "psl"

import type { OryRequest } from "./types"

/**
 * Two origins are the same site when their hostnames are equal or share the
 * same registrable domain (eTLD+1). Cookies scoped to the registrable domain
 * are visible to both, so the app can talk to Ory directly without proxying.
 *
 * @param originA - The first origin or URL.
 * @param originB - The second origin or URL.
 * @returns Whether both are on the same site.
 * @public
 */
export function isSameSite(originA: string, originB: string): boolean {
  let hostA: string
  let hostB: string
  try {
    hostA = new URL(originA).hostname
    hostB = new URL(originB).hostname
  } catch {
    return false
  }

  if (hostA === hostB) {
    return true
  }

  // get() returns null for IP addresses, single-label hosts (localhost), and
  // hostnames that are themselves a public suffix (e.g. *.vercel.app, which
  // is on the Public Suffix List, making sibling deployments cross-site).
  const domainA = get(hostA)
  const domainB = get(hostB)
  return Boolean(domainA && domainB && domainA === domainB)
}

/**
 * Returns the origin the browser used for a request: the protocol of the
 * request URL and the `Host` header, falling back to the host of the URL.
 *
 * @param req - The incoming request.
 * @returns The origin, for example `http://localhost:3000`.
 * @public
 */
export function requestOrigin(req: OryRequest): string {
  const url = new URL(req.url)
  return url.protocol + "//" + (req.headers.get("host") || url.host)
}

/**
 * Returns the origin when the value is exactly an `http:` or `https:` origin,
 * optionally with one trailing slash, and `null` otherwise. User info, a path,
 * a query, a fragment, a spelled-out default port, and upper case in the host
 * all make the value invalid.
 *
 * @internal
 */
export function parseOrigin(value: string): string | null {
  const candidate = value.replace(/\/$/, "")
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return null
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null
  }
  return url.origin === candidate ? candidate : null
}
