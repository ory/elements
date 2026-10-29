// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  oryBaseUrlWarning,
  requestOrigin,
  resolveOryBaseUrl,
  type OryBaseUrlReason,
  type OryProxyState,
} from "@ory/ssr"
import { getGlobalStartContext } from "@tanstack/react-start"
import {
  getRequest,
  getResponseHeader,
  setResponseHeader,
} from "@tanstack/react-start/server"
import { orySdkUrl } from "./env"

const warned = new Set<OryBaseUrlReason>()

// Only request middleware writes the global start context. The server
// function handler's own `context` argument also carries client input.
function proxyState(): OryProxyState {
  const context: unknown = getGlobalStartContext()
  if (typeof context !== "object" || context === null) {
    return "absent"
  }
  const marker = (context as { oryProxy?: unknown }).oryProxy
  return marker === "trusted-origin" || marker === "untrusted-origin"
    ? marker
    : "absent"
}

export function resolveRequestOryBaseUrl(request: Request): string {
  const opts = {
    sdkUrl: orySdkUrl(),
    origin: requestOrigin(request),
    proxy: proxyState(),
  }
  const resolved = resolveOryBaseUrl(opts)
  const warning = oryBaseUrlWarning(resolved, opts)
  if (warning && !warned.has(resolved.reason)) {
    warned.add(resolved.reason)
    console.warn(`[@ory/tanstack-start] ${warning}`)
  }
  return resolved.url
}

export const privateNoStore = { "Cache-Control": "private, no-store" }

export function preventSharedCaching(): void {
  setResponseHeader("Cache-Control", privateNoStore["Cache-Control"])
}

// TanStack Start and h3 drop headers set with `setResponseHeader` from
// responses that are not 2xx, such as a 404 page rendered after a loader
// fetched the session.
export function keepSharedCachingPrevented(response: Response): Response {
  const cacheControl = privateNoStore["Cache-Control"]
  if (response.ok || getResponseHeader("Cache-Control") !== cacheControl) {
    return response
  }
  try {
    response.headers.set("Cache-Control", cacheControl)
    return response
  } catch {
    const copy = new Response(response.body, response)
    copy.headers.set("Cache-Control", cacheControl)
    return copy
  }
}

/**
 * Returns the URL the browser uses to reach Ory for the current request, and
 * marks the response as private and not storable. The flow, logout, and error
 * helpers use the same URL, and the flow and error helpers attach it to what
 * they return, where the Ory Elements components read it. Call it from the
 * handler of a `createServerFn`, and pass the result as `baseUrl` to
 * `SessionProvider`.
 *
 * The URL is the app's origin only when `oryProxyMiddleware` handled the
 * request and the origin is in its `trustedOrigins`. Otherwise it is
 * `ORY_SDK_URL`, and a warning with the fix is logged once when that cannot
 * work.
 *
 * @example
 * ```ts
 * export const oryBaseUrlFn = createServerFn({ method: "GET" }).handler(() =>
 *   getOryBaseUrl(),
 * )
 * ```
 *
 * @returns The browser URL, without a trailing slash.
 * @public
 */
export function getOryBaseUrl(): string {
  preventSharedCaching()
  return resolveRequestOryBaseUrl(getRequest())
}
