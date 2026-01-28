// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */

import {
  defineEventHandler,
  getRequestHeaders,
  readBody,
  getRequestURL,
  getMethod,
  setResponseHeaders,
  send,
  H3Event,
} from "h3"
import { useRuntimeConfig } from "#imports"
import { orySdkUrl } from "../utils/sdk"
import { filterRequestHeaders, defaultOmitHeaders } from "../utils/headers"
import { processSetCookieHeaders } from "../utils/cookie"
import { rewriteUrls } from "../utils/rewrite"

/**
 * Server handler that proxies requests to Ory
 */
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const requestUrl = getRequestURL(event)
  const method = getMethod(event)
  const requestHeaders = getRequestHeaders(event)

  // Get the Ory SDK URL
  const sdkUrl = orySdkUrl()
  const matchBaseUrl = new URL(sdkUrl)
  const appBaseHost = requestHeaders.host || requestUrl.host
  const selfUrl = `${requestUrl.protocol}//${appBaseHost}`

  // Build upstream URL
  const upstreamUrl = new URL(
    requestUrl.pathname + requestUrl.search,
    matchBaseUrl,
  )
  upstreamUrl.hostname = matchBaseUrl.hostname
  upstreamUrl.host = matchBaseUrl.host
  upstreamUrl.protocol = matchBaseUrl.protocol
  upstreamUrl.port = matchBaseUrl.port

  // Filter and prepare headers
  const headers = new Headers()
  Object.entries(requestHeaders).forEach(([key, value]) => {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value)
    }
  })

  const upstreamRequestHeaders = filterRequestHeaders(
    headers,
    config.ory?.forwardAdditionalHeaders,
  )
  upstreamRequestHeaders.set("Host", upstreamUrl.host)
  upstreamRequestHeaders.set("Ory-Base-URL-Rewrite", selfUrl)
  upstreamRequestHeaders.set("Ory-No-Custom-Domain-Redirect", "true")

  // Add API token if available
  const apiToken = process.env.ORY_PROJECT_API_TOKEN
  if (apiToken) {
    upstreamRequestHeaders.set("Ory-Base-URL-Rewrite-Token", apiToken)
  }

  // Get request body for non-GET requests
  let body: string | Buffer | null = null
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await readBody(event)
      if (typeof body === "object") {
        body = JSON.stringify(body)
      }
    } catch {
      // No body
    }
  }

  // Fetch from upstream
  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method,
    headers: upstreamRequestHeaders,
    body: body,
    redirect: "manual",
  })

  // Build response headers
  const responseHeaders: Record<string, string> = {}
  upstreamResponse.headers.forEach((value, key) => {
    if (!defaultOmitHeaders.includes(key.toLowerCase())) {
      responseHeaders[key] = value
    }
  })

  // Process cookies - must be set individually, not joined
  const setCookieHeader = upstreamResponse.headers.get("set-cookie")
  if (setCookieHeader) {
    const cookies = processSetCookieHeaders(
      requestUrl.protocol,
      upstreamResponse,
      { forceCookieDomain: config.ory?.forceCookieDomain },
      headers,
    )
    delete responseHeaders["set-cookie"]
    // Set cookies directly on the response - H3 handles multiple Set-Cookie headers
    if (cookies.length > 0) {
      for (const cookie of cookies) {
        event.node.res.appendHeader("Set-Cookie", cookie)
      }
    }
  }

  // Rewrite location header
  const originalLocation = upstreamResponse.headers.get("location")
  if (originalLocation) {
    let location = originalLocation

    // Handle legacy hosted UI redirect
    if (location.startsWith("../self-service")) {
      location = location.replace("../self-service", "/self-service")
    } else if (!location.startsWith("http")) {
      location = new URL(location, matchBaseUrl).toString()
    }

    location = rewriteUrls(location, matchBaseUrl.toString(), selfUrl)

    if (!location.startsWith("http")) {
      location = new URL(location, selfUrl).toString()
    }

    responseHeaders["location"] = location
  }

  // Get response body
  let responseBody = Buffer.from(await upstreamResponse.arrayBuffer())

  // Rewrite body content if text or JSON
  const contentType = upstreamResponse.headers.get("content-type")
  if (
    contentType?.includes("text/") ||
    contentType?.includes("application/json")
  ) {
    const bodyString = responseBody.toString("utf-8")
    responseBody = Buffer.from(
      rewriteUrls(bodyString, matchBaseUrl.toString(), selfUrl),
    )
  }

  // Set response
  setResponseHeaders(event, responseHeaders)
  event.node.res.statusCode = upstreamResponse.status
  return send(event, responseBody)
})
