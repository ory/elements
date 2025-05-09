// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryMiddlewareOptions } from "src/middleware/middleware"
import { orySdkUrl } from "./sdk"
import { joinUrlPaths } from "./utils"

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: OryMiddlewareOptions,
) {
  for (const [_, [matchPath, replaceWith]] of [
    // TODO load these dynamically from the project config

    // Old AX routes
    ["/ui/recovery", config.project?.recovery_ui_url],
    ["/ui/registration", config.project?.registration_ui_url],
    ["/ui/login", config.project?.login_ui_url],
    ["/ui/verification", config.project?.verification_ui_url],
    ["/ui/settings", config.project?.settings_ui_url],
    ["/ui/welcome", config.project?.default_redirect_url],

    // New AX routes
    ["/recovery", config.project?.recovery_ui_url],
    ["/registration", config.project?.registration_ui_url],
    ["/login", config.project?.login_ui_url],
    ["/verification", config.project?.verification_ui_url],
    ["/settings", config.project?.settings_ui_url],
  ].entries()) {
    const match = joinUrlPaths(matchBaseUrl, matchPath || "")
    if (replaceWith && source.startsWith(match)) {
      source = source.replaceAll(
        match,
        new URL(replaceWith, selfUrl).toString(),
      )
    }
  }
  return source.replaceAll(
    matchBaseUrl.replace(/\/$/, ""),
    new URL(selfUrl).toString().replace(/\/$/, ""),
  )
}

/**
 * Rewrites Ory SDK URLs in JSON responses (objects, arrays, strings) with the provided proxy URL.
 *
 * If `proxyUrl` is provided, the SDK URL is replaced with the proxy URL.
 *
 * @param obj - The object to rewrite
 * @param proxyUrl - The proxy URL to replace the SDK URL with
 */
export function rewriteJsonResponse<T extends object>(
  obj: T,
  proxyUrl?: string,
): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // Recursively process each item in the array
          return [
            key,
            value
              .map((item) => {
                if (typeof item === "object" && item !== null) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return rewriteJsonResponse(item, proxyUrl)
                } else if (typeof item === "string" && proxyUrl) {
                  return item.replaceAll(orySdkUrl(), proxyUrl)
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return item
              })
              .filter((item) => item !== undefined),
          ]
        } else if (typeof value === "object" && value !== null) {
          // Recursively remove undefined in nested objects
          return [key, rewriteJsonResponse(value, proxyUrl)]
        } else if (typeof value === "string" && proxyUrl) {
          // Replace SDK URL with the provided proxy URL
          return [key, value.replaceAll(orySdkUrl(), proxyUrl)]
        }
        return [key, value]
      }),
  ) as T
}
