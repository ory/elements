// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NextResponse, type NextRequest } from "next/server"

import { AccountExperienceConfiguration } from "@ory/client-fetch"
import { requestOrigin } from "@ory/ssr"
import {
  checkTrustedOrigins,
  handleOryProxy,
  isOryProxyPath,
  isTrustedOrigin,
} from "@ory/ssr/proxy"
import {
  originFromHeaders,
  oryProxyHeader,
  oryProxyHeaderValues,
  protocolFromHeaders,
} from "../utils/ory-url"
import { orySdkUrl } from "../utils/sdk"

export function getProjectApiKey() {
  let baseUrl = ""

  if (process.env["ORY_PROJECT_API_TOKEN"]) {
    baseUrl = process.env["ORY_PROJECT_API_TOKEN"]
  }

  return baseUrl.replace(/\/$/, "")
}

/**
 * @hidden
 * @inline
 * @public
 */
export type OryMiddlewareOptions = {
  /**
   * By default headers are filtered to forward only a fixed list, which
   * includes the browser's `Origin` and `Sec-Fetch-*` headers.
   *
   * If you need to forward additional headers you can use this setting to define them.
   */
  forwardAdditionalHeaders?: string[]
  /**
   * If you want to force a specific cookie domain, you can set it here.
   *
   * Cookies with the `__Host-` prefix never get a domain and stay bound to the
   * host that set them.
   */
  forceCookieDomain?: string
  /**
   * If you want to use a specific project configuration, you can set it here.
   *
   * Make sure to pass the same project configuration that you pass to `@ory/elements-react`
   */
  project?: Partial<AccountExperienceConfiguration>
  /**
   * Origins this deployment serves. The middleware signs the
   * `Ory-Base-URL-Rewrite` header only for a request whose origin is a valid
   * origin that matches one of these entries; otherwise Ory uses the
   * project's configured base URL. Required: `createOryMiddleware` throws
   * when it is unset, empty, or has an invalid entry.
   *
   * An entry is an origin without a path. To match several origins, use `*`
   * in the host as a glob. Each `*` matches one or more letters, digits, or
   * hyphens within one DNS label, and never a dot. A `*` can't make up the whole label right before
   * a public suffix from the Public Suffix List, such as `vercel.app` or
   * `com`: `https://*.vercel.app` is rejected,
   * `https://my-app-*-my-team.vercel.app` is accepted.
   *
   * @example ["http://localhost:3000", "https://my-app-*-my-team.vercel.app"]
   */
  trustedOrigins?: string[]
}

function passThrough(request: NextRequest, options: OryMiddlewareOptions) {
  const origin = originFromHeaders(
    request.headers,
    request.nextUrl.protocol.replace(/:$/, ""),
  )
  const headers = new Headers(request.headers)
  headers.set(
    oryProxyHeader,
    isTrustedOrigin(origin, options.trustedOrigins ?? [])
      ? oryProxyHeaderValues.trusted
      : oryProxyHeaderValues.untrusted,
  )
  return NextResponse.next({ request: { headers } })
}

export async function proxyRequest(
  request: NextRequest,
  options: OryMiddlewareOptions,
) {
  if (!isOryProxyPath(request.nextUrl.pathname)) {
    return passThrough(request, options)
  }

  const sdkUrl = orySdkUrl()
  const url = new URL(request.nextUrl.origin)
  url.protocol = protocolFromHeaders(
    request.headers,
    request.nextUrl.protocol.replace(/:$/, ""),
  )
  url.pathname = request.nextUrl.pathname
  if (request.nextUrl.search) {
    url.search = request.nextUrl.search
  }

  const upstreamRequest = new Request(url, {
    method: request.method,
    headers: request.headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : null,
  })
  const origin = requestOrigin(upstreamRequest)
  const response = await handleOryProxy(upstreamRequest, {
    ...options,
    sdkUrl,
    projectApiKey: getProjectApiKey(),
    trustedOrigins: isTrustedOrigin(origin, options.trustedOrigins ?? [])
      ? [origin]
      : undefined,
  })
  if (!response) {
    return NextResponse.next()
  }

  // Next.js throws an error that is completely unhelpful if the location header is not an absolute URL.
  // Therefore, we throw a more helpful error message here.
  const location = response.headers.get("location")
  if (location && !location.startsWith("http")) {
    throw new Error(
      "[@ory/nextjs] The HTTP location header must be an absolute URL in Next.js middleware. However, it is not. The resulting HTTP location is `" +
        location +
        "`. Check that `NEXT_PUBLIC_ORY_SDK_URL` is an absolute URL that includes the scheme. If it is, open an issue on https://github.com/ory/elements/issues.",
    )
  }

  return new NextResponse(response.body && (await response.arrayBuffer()), {
    headers: response.headers,
    status: response.status,
  })
}

/**
 * Creates a Next.js middleware function that proxies requests to the Ory SDK.
 *
 * The middleware serves Ory's paths on the app's origin. Use it for local
 * development and preview deployments.
 *
 * @example
 * ```ts title="middleware.ts"
 * import { createOryMiddleware } from "@ory/nextjs/middleware";
 *
 * export const middleware = createOryMiddleware({
 *   trustedOrigins: [
 *     "http://localhost:3000",
 *     "https://my-app-*-my-team.vercel.app",
 *   ],
 *   forwardAdditionalHeaders: ["authorization", "x-custom-header"],
 *   project: {
 *     name: "my-project",
 *   },
 * });
 * ```
 *
 * @param options - The Ory configuration to use for the middleware.
 * @returns The Ory Next.js middleware function
 * @public
 */
export function createOryMiddleware(options: OryMiddlewareOptions) {
  checkTrustedOrigins(options.trustedOrigins, "@ory/nextjs")
  return (r: NextRequest) => {
    return proxyRequest(r, options)
  }
}
