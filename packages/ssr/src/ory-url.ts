// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { withoutTrailingSlash } from "./client"
import { isSameSite, parseOrigin } from "./url"

/**
 * What the Ory proxy reported for a request:
 *
 * - `trusted-origin`: the proxy handled the request, and its origin is in `trustedOrigins`.
 * - `untrusted-origin`: the proxy handled the request, and its origin is not in `trustedOrigins`.
 * - `absent`: the proxy did not mark the request.
 *
 * @public
 */
export type OryProxyState = "trusted-origin" | "untrusted-origin" | "absent"

/**
 * Why {@link resolveOryBaseUrl} chose the browser URL:
 *
 * - `same-site`: the app and Ory are on the same site, so the browser calls Ory directly.
 * - `proxy`: the Ory proxy serves Ory on the app's trusted origin.
 * - `proxy-untrusted-origin`: the Ory proxy handled the request, but the origin is not in `trustedOrigins`.
 * - `cross-site-no-proxy`: the app and Ory are on different sites, and the Ory proxy did not handle the request.
 * - `invalid-origin`: the request's origin is not a valid origin.
 *
 * Only `same-site` and `proxy` produce a working setup. For the others,
 * {@link oryBaseUrlWarning} explains what to change.
 *
 * @public
 */
export type OryBaseUrlReason =
  | "same-site"
  | "proxy"
  | "proxy-untrusted-origin"
  | "cross-site-no-proxy"
  | "invalid-origin"

/**
 * Options for {@link resolveOryBaseUrl}.
 *
 * @public
 */
export type ResolveOryBaseUrlOptions = {
  /**
   * The URL of the Ory project or Ory Kratos instance, for example
   * `https://<slug>.projects.oryapis.com`.
   */
  sdkUrl: string
  /**
   * The origin the browser used for this request, for example from
   * {@link requestOrigin}.
   */
  origin: string
  /**
   * What the Ory proxy reported for this request.
   */
  proxy: OryProxyState
}

/**
 * The URL the browser uses to reach Ory, and why it was chosen.
 *
 * @public
 */
export type ResolvedOryBaseUrl = {
  /**
   * The browser URL, without a trailing slash.
   */
  url: string
  reason: OryBaseUrlReason
}

/**
 * Resolves the URL the browser uses to reach Ory for one request. The first
 * matching rule wins:
 *
 * 1. The origin is not a valid origin: the SDK URL (`invalid-origin`).
 * 2. The origin and the SDK URL are on the same site: the SDK URL (`same-site`).
 * 3. The proxy handled the request for a trusted origin: the origin (`proxy`).
 * 4. The proxy handled the request for an untrusted origin: the SDK URL (`proxy-untrusted-origin`).
 * 5. Otherwise: the SDK URL (`cross-site-no-proxy`).
 *
 * @example
 * ```ts
 * const { url, reason } = resolveOryBaseUrl({
 *   sdkUrl: "https://<slug>.projects.oryapis.com",
 *   origin: requestOrigin(request),
 *   proxy: "absent",
 * })
 * ```
 *
 * @param opts - The SDK URL, the request's origin, and what the proxy reported.
 * @returns The browser URL and the reason.
 * @throws TypeError when `sdkUrl` is not an absolute `http:` or `https:` URL.
 * @public
 */
export function resolveOryBaseUrl(
  opts: ResolveOryBaseUrlOptions,
): ResolvedOryBaseUrl {
  const sdkUrl = withoutTrailingSlash(opts.sdkUrl)
  let protocol: string
  try {
    protocol = new URL(sdkUrl).protocol
  } catch {
    protocol = ""
  }
  if (protocol !== "http:" && protocol !== "https:") {
    throw new TypeError(
      `[@ory/ssr] The Ory SDK URL "${opts.sdkUrl}" is not an absolute URL. Set it to the URL of your Ory project, for example \`https://<slug>.projects.oryapis.com\`.`,
    )
  }

  const origin = parseOrigin(opts.origin)
  if (origin === null) {
    return { url: sdkUrl, reason: "invalid-origin" }
  }
  if (isSameSite(origin, sdkUrl)) {
    return { url: sdkUrl, reason: "same-site" }
  }
  switch (opts.proxy) {
    case "trusted-origin":
      return { url: origin, reason: "proxy" }
    case "untrusted-origin":
      return { url: sdkUrl, reason: "proxy-untrusted-origin" }
    default:
      return { url: sdkUrl, reason: "cross-site-no-proxy" }
  }
}

const docsLink =
  "https://www.ory.com/docs/elements/guides/configuration#base-url"

/**
 * Returns the warning for a resolution that does not produce a working
 * setup, or `null` for `same-site` and `proxy`. The text has no package
 * prefix; adapters add their own and log it once per reason.
 *
 * @param resolved - The result of {@link resolveOryBaseUrl}.
 * @param opts - The options passed to {@link resolveOryBaseUrl}.
 * @returns The warning text, or `null`.
 * @public
 */
export function oryBaseUrlWarning(
  resolved: ResolvedOryBaseUrl,
  opts: ResolveOryBaseUrlOptions,
): string | null {
  switch (resolved.reason) {
    case "same-site":
    case "proxy":
      return null
    case "invalid-origin":
      return `The request's \`Host\` header is not a valid origin, so the browser calls Ory directly at ${resolved.url}. Make sure the server that runs the app receives the host the browser visited. See ${docsLink}`
    case "proxy-untrusted-origin":
      return `The Ory proxy handled a request for ${opts.origin}, which is not in \`trustedOrigins\`. The browser calls Ory directly at ${resolved.url}, so Ory's session cookies will not reach the app. In local development or a preview deployment, add the origin to \`trustedOrigins\`. In production, serve Ory on a custom domain on the app's site. See ${docsLink}`
    case "cross-site-no-proxy":
      return `The app (${opts.origin}) and Ory (${resolved.url}) are on different sites, and the Ory proxy did not handle this request. The browser calls Ory directly, so Ory's session cookies will not reach the app. Make sure the Ory proxy runs for this page. See ${docsLink}`
  }
}
