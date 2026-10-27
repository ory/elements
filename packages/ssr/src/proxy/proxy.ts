// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { AccountExperienceConfiguration } from "@ory/client-fetch"

import { requestOrigin } from "../url"
import { defaultOmitHeaders } from "./headers"
import { rewriteUrls } from "./rewrite"
import { checkTrustedOrigins, isTrustedOrigin } from "./trusted-origin"
import { filterRequestHeaders, processSetCookieHeaders } from "./utils"

/**
 * The path prefixes the proxy forwards to Ory.
 *
 * @public
 */
export const oryProxyPaths: readonly string[] = [
  "/self-service",
  "/sessions/whoami",
  "/ui",
  "/.well-known/ory",
  "/.ory",
]

const nullBodyStatuses = [204, 205, 304]

const checkedTrustedOrigins = new WeakSet<ReadonlyArray<string>>()

/**
 * Options for {@link handleOryProxy}.
 *
 * @public
 */
export type OryProxyOptions = {
  /**
   * The URL of the Ory project or Ory Kratos instance, for example
   * `https://<slug>.projects.oryapis.com`.
   */
  sdkUrl: string
  /**
   * The Ory project API key that signs the base URL rewrite for trusted
   * origins.
   */
  projectApiKey?: string
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
   * Origins this deployment serves. The proxy signs the
   * `Ory-Base-URL-Rewrite` header only for a request whose origin is a valid
   * origin that matches one of these entries; otherwise Ory uses the
   * project's configured base URL.
   *
   * An entry is an origin without a path. To match several origins, use `*`
   * in the host as a glob.
   * Each `*` matches one or more letters, digits, or hyphens within one DNS
   * label, and never a dot. A `*` can't make up the whole label right before
   * a public suffix from the Public Suffix List, such as `vercel.app` or
   * `com`: `https://*.vercel.app` is rejected,
   * `https://my-app-*-my-team.vercel.app` is accepted. An invalid entry throws.
   *
   * @example ["http://localhost:3000", "https://my-app-*-my-team.vercel.app"]
   */
  trustedOrigins?: ReadonlyArray<string>
}

/**
 * Returns whether the proxy handles requests to this path.
 *
 * @param pathname - The path of the request URL.
 * @returns Whether the path belongs to Ory.
 * @public
 */
export function isOryProxyPath(pathname: string): boolean {
  return oryProxyPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  )
}

/**
 * Proxies a request for an Ory path to Ory and rewrites the response so the
 * browser keeps talking to the app's origin: `Set-Cookie` domains, the
 * `Location` header, and Ory URLs in text and JSON bodies.
 *
 * Use it for local development and preview deployments. Through the proxy,
 * Ory sees every request coming from the app server instead of the user's
 * browser. In production, serve Ory on a custom domain of your Ory Network
 * project, or on your own domain with the Ory Enterprise License.
 *
 * @example
 * ```ts
 * const response = await handleOryProxy(request, {
 *   sdkUrl: "https://<slug>.projects.oryapis.com",
 *   trustedOrigins: ["http://localhost:3000"],
 * })
 * if (response) {
 *   return response
 * }
 * ```
 *
 * @param request - The incoming request.
 * @param opts - The proxy options.
 * @returns The response for the browser, or `null` when the request is not for an Ory path.
 * @public
 */
export async function handleOryProxy(
  request: Request,
  opts: OryProxyOptions,
): Promise<Response | null> {
  const url = new URL(request.url)
  if (!isOryProxyPath(url.pathname)) {
    return null
  }

  if (opts.trustedOrigins && !checkedTrustedOrigins.has(opts.trustedOrigins)) {
    checkTrustedOrigins(opts.trustedOrigins, "@ory/ssr")
    checkedTrustedOrigins.add(opts.trustedOrigins)
  }

  const matchBaseUrl = new URL(opts.sdkUrl.replace(/\/$/, ""))
  const selfUrl = requestOrigin(request)

  const upstreamUrl = new URL(url)
  upstreamUrl.hostname = matchBaseUrl.hostname
  upstreamUrl.host = matchBaseUrl.host
  upstreamUrl.protocol = matchBaseUrl.protocol
  upstreamUrl.port = matchBaseUrl.port

  const upstreamRequestHeaders = filterRequestHeaders(
    request.headers,
    opts.forwardAdditionalHeaders,
  )
  upstreamRequestHeaders.set("Host", upstreamUrl.host)

  // The signed base URL rewrite steers other users' courier links and OIDC
  // redirects server-side, so it must not be derived from an untrusted Host
  // header. A non-matching origin omits the pair so Ory falls back to the
  // project's configured base URL.
  if (opts.trustedOrigins && isTrustedOrigin(selfUrl, opts.trustedOrigins)) {
    // Ensures we use the correct URL in redirects like OIDC redirects.
    upstreamRequestHeaders.set("Ory-Base-URL-Rewrite", selfUrl.toString())
    upstreamRequestHeaders.set(
      "Ory-Base-URL-Rewrite-Token",
      opts.projectApiKey ?? "",
    )
  }

  upstreamRequestHeaders.set("Ory-No-Custom-Domain-Redirect", "true")

  let upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers: upstreamRequestHeaders,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : null,
    redirect: "manual",
  })
  upstreamResponse = new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    // response may have immutable headers
    headers: new Headers(upstreamResponse.headers),
  })

  defaultOmitHeaders.forEach((header) => {
    upstreamResponse.headers.delete(header)
  })

  if (upstreamResponse.headers.get("set-cookie")) {
    const cookies = processSetCookieHeaders(
      url.protocol,
      upstreamResponse,
      opts,
      request.headers,
    )
    upstreamResponse.headers.delete("set-cookie")
    cookies.forEach((cookie) => {
      upstreamResponse.headers.append("Set-Cookie", cookie)
    })
  }

  const originalLocation = upstreamResponse.headers.get("location")
  if (originalLocation) {
    let location = originalLocation

    // The legacy hostedui does a redirect to `../self-service` which breaks the proxy.
    // To fix this, we hard-rewrite `../self-service`.
    //
    // This is not needed with the "new" account experience based on this SDK.
    if (location.startsWith("../self-service")) {
      location = location.replace("../self-service", "/self-service")
    } else if (!location.startsWith("http")) {
      // If the location header is not an absolute URL, we need to make it one for rewriteUrls to properly rewrite it.
      location = new URL(location, matchBaseUrl).toString()
    }

    location = rewriteUrls(location, matchBaseUrl.toString(), selfUrl, opts)

    if (!location.startsWith("http")) {
      location = new URL(location, selfUrl).toString()
    }

    upstreamResponse.headers.set("location", location)
  }

  let body = new Uint8Array(await upstreamResponse.arrayBuffer())
  const contentType = upstreamResponse.headers.get("content-type")
  if (
    contentType?.includes("text/") ||
    contentType?.includes("application/json")
  ) {
    // ignoreBOM keeps a leading byte order mark in the rewritten body.
    const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(body)
    body = new TextEncoder().encode(
      rewriteUrls(text, matchBaseUrl.toString(), selfUrl, opts),
    )
  }

  return new Response(
    nullBodyStatuses.includes(upstreamResponse.status) ? null : body,
    {
      headers: upstreamResponse.headers,
      status: upstreamResponse.status,
    },
  )
}
