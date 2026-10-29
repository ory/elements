// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  oryBaseUrlWarning,
  OryBaseUrlReason,
  OryRequest,
  requestOrigin,
  resolveOryBaseUrl,
} from "@ory/ssr"
import { redirectDocument, replace } from "react-router"
import { proxyState } from "./registration"

/**
 * Removes the `.data` suffix and the `_routes` and `index` parameters that
 * React Router adds to client-side data requests, so they do not end up in
 * the URLs sent to Ory.
 */
export function toOryRequest(request: Request): OryRequest {
  const url = new URL(request.url)
  url.pathname = url.pathname.endsWith("/_.data")
    ? url.pathname.replace(/_\.data$/, "")
    : url.pathname.replace(/\.data$/, "")
  url.searchParams.delete("_routes")
  if (url.searchParams.getAll("index").every((value) => value === "")) {
    url.searchParams.delete("index")
  }
  return { url, headers: request.headers }
}

const warned = new Set<OryBaseUrlReason>()

export function resolveBaseUrl(request: OryRequest, sdkUrl: string): string {
  const origin = requestOrigin(request)
  const opts = { sdkUrl, origin, proxy: proxyState(origin) }
  const resolved = resolveOryBaseUrl(opts)
  const warning = oryBaseUrlWarning(resolved, opts)
  if (warning && !warned.has(resolved.reason)) {
    warned.add(resolved.reason)
    console.warn(`[@ory/react-router] ${warning}`)
  }
  return resolved.url
}

/**
 * Builds the redirect for a target returned by `@ory/ssr`. Targets other than
 * the app's own flow page are served by Ory, so they need a document request
 * instead of a client-side navigation.
 */
export function toRedirect(
  redirectTo: string,
  route: string,
  requestUrl: string | URL,
): Response {
  const target = new URL(redirectTo, requestUrl)
  const page = new URL(route, requestUrl)
  const response =
    target.origin === page.origin && target.pathname === page.pathname
      ? replace(redirectTo)
      : redirectDocument(redirectTo)
  response.headers.set("Cache-Control", "private, no-store")
  return response
}
