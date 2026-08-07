// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  type AnyRequestMiddleware,
  createMiddleware,
} from "@tanstack/react-start"
import type { OryMiddlewareOptions } from "../types"
import { rewriteSetCookieHeaders } from "../utils/cookie"
import { rewriteConfiguredUiRoutes, rewriteUrls } from "../utils/rewrite"

const proxyPaths = [
  "/self-service",
  "/sessions/whoami",
  "/ui",
  "/.well-known/ory",
  "/.ory",
]

const defaultForwardedHeaders = [
  "accept",
  "accept-charset",
  "accept-encoding",
  "accept-language",
  "authorization",
  "cache-control",
  "content-type",
  "cookie",
  "host",
  "user-agent",
  "referer",
]

const defaultOmitHeaders = [
  "transfer-encoding",
  "content-encoding",
  "content-length",
]

function isProxyPath(pathname: string): boolean {
  return proxyPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

function filterRequestHeaders(
  headers: Headers,
  additional: string[] = [],
): Headers {
  const allowed = new Set([
    ...defaultForwardedHeaders,
    ...additional.map((header) => header.toLowerCase()),
  ])
  const filtered = new Headers()
  headers.forEach((value, key) => {
    if (allowed.has(key.toLowerCase())) filtered.set(key, value)
  })
  return filtered
}

function rewriteProxyUrls(
  source: string,
  options: OryMiddlewareOptions,
  appOrigin: string,
): string {
  const urls = new Set([
    options.sdkUrl.replace(/\/$/, ""),
    (options.serverSdkUrl ?? options.sdkUrl).replace(/\/$/, ""),
    appOrigin.replace(/\/$/, ""),
  ])
  let rewritten = source
  for (const sdkUrl of urls) {
    rewritten = rewriteUrls(rewritten, sdkUrl, appOrigin, options)
  }
  return rewritten
}

/**
 * Proxies an Ory browser endpoint using standard Fetch API objects.
 * Returns `undefined` when the request is not for an Ory endpoint.
 *
 * @public
 */
export async function proxyRequest(
  request: Request,
  options: OryMiddlewareOptions,
): Promise<Response | undefined> {
  const requestUrl = new URL(request.url)
  if (!isProxyPath(requestUrl.pathname)) {
    return undefined
  }

  const appOrigin = new URL(options.appUrl ?? request.url).origin
  const configuredUiUrl = rewriteConfiguredUiRoutes(
    request.url,
    requestUrl.origin,
    appOrigin,
    options,
  )
  if (configuredUiUrl !== request.url) {
    return Response.redirect(configuredUiUrl, 302)
  }

  const serverSdkUrl = (options.serverSdkUrl ?? options.sdkUrl).replace(
    /\/$/,
    "",
  )
  const sdkOrigin = new URL(serverSdkUrl)
  const upstreamUrl = new URL(request.url)
  upstreamUrl.hostname = sdkOrigin.hostname
  upstreamUrl.protocol = sdkOrigin.protocol
  upstreamUrl.host = sdkOrigin.host
  upstreamUrl.port = sdkOrigin.port

  const headers = filterRequestHeaders(
    request.headers,
    options.forwardAdditionalHeaders,
  )
  headers.set("host", upstreamUrl.host)
  headers.set("ory-base-url-rewrite", appOrigin)
  if (options.projectApiToken) {
    headers.set("ory-base-url-rewrite-token", options.projectApiToken)
  }
  headers.set("ory-no-custom-domain-redirect", "true")

  const upstreamResponse = await (options.fetchApi ?? fetch)(
    upstreamUrl.toString(),
    {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "manual",
    },
  )
  const responseHeaders = new Headers(upstreamResponse.headers)
  defaultOmitHeaders.forEach((header) => responseHeaders.delete(header))
  if (responseHeaders.has("set-cookie")) {
    const cookies = rewriteSetCookieHeaders({
      response: upstreamResponse,
      appUrl: appOrigin,
      forceCookieDomain: options.forceCookieDomain,
    })
    responseHeaders.delete("set-cookie")
    cookies.forEach((cookie) => responseHeaders.append("set-cookie", cookie))
  }
  const originalLocation = responseHeaders.get("location")
  if (originalLocation) {
    let location = originalLocation
    if (location.startsWith("../self-service")) {
      location = location.replace("../self-service", "/self-service")
    }
    if (!/^https?:\/\//i.test(location)) {
      location = new URL(location, serverSdkUrl).toString()
    }
    responseHeaders.set(
      "location",
      rewriteProxyUrls(location, options, appOrigin),
    )
  }

  const canHaveBody =
    request.method !== "HEAD" &&
    ![204, 205, 304].includes(upstreamResponse.status)
  let body: BodyInit | null = null
  if (canHaveBody) {
    const contentType = responseHeaders.get("content-type") ?? ""
    body = await upstreamResponse.arrayBuffer()
    if (
      contentType.includes("text/") ||
      contentType.includes("application/json")
    ) {
      body = rewriteProxyUrls(
        new TextDecoder().decode(body),
        options,
        appOrigin,
      )
    }
  }

  return new Response(body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  })
}

/** Creates TanStack Start request middleware for the Ory browser proxy. @public */
export function createOryMiddleware(
  options: OryMiddlewareOptions,
): AnyRequestMiddleware {
  return createMiddleware({ type: "request" }).server(
    async ({ request, next }) => {
      return (await proxyRequest(request, options)) ?? next()
    },
  )
}

export type { OryMiddlewareOptions } from "../types"
