// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryConfig } from "../types"
import { joinUrlPaths } from "./utils"
import { orySdkUrl } from "./sdk"

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: OryConfig,
) {
  for (const [_, [matchPath, replaceWith]] of [
    // TODO load these dynamically from the project config
    ["/ui/recovery", config.override?.recoveryUiPath],
    ["/ui/registration", config.override?.registrationUiPath],
    ["/ui/login", config.override?.loginUiPath],
    ["/ui/verification", config.override?.verificationUiPath],
    ["/ui/settings", config.override?.settingsUiPath],
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
 * @param obj
 * @param proxyUrl
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
                  return rewriteJsonResponse(item, proxyUrl)
                } else if (typeof item === "string" && proxyUrl) {
                  return item.replaceAll(orySdkUrl(), proxyUrl)
                }
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
