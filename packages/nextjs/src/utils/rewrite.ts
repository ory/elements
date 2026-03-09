// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryMiddlewareOptions } from "src/middleware/middleware"
import { orySdkUrl } from "./sdk"

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: OryMiddlewareOptions,
) {
  // OAuth2 endpoints must stay on Ory's domain
  const oauth2Paths = [
    "/oauth2/",
    "/userinfo",
    "/.well-known/openid-configuration",
    "/.well-known/jwks.json",
  ]

  // UI path mappings from project config
  // TODO: load these dynamically from the project config
  const uiPathMappings: Record<string, string | undefined> = {
    // Old AX routes
    "/ui/recovery": config.project?.recovery_ui_url,
    "/ui/registration": config.project?.registration_ui_url,
    "/ui/login": config.project?.login_ui_url,
    "/ui/verification": config.project?.verification_ui_url,
    "/ui/settings": config.project?.settings_ui_url,
    "/ui/welcome": config.project?.default_redirect_url,
    // New AX routes
    "/recovery": config.project?.recovery_ui_url,
    "/registration": config.project?.registration_ui_url,
    "/login": config.project?.login_ui_url,
    "/verification": config.project?.verification_ui_url,
    "/settings": config.project?.settings_ui_url,
  }

  const baseUrlNormalized = matchBaseUrl.replace(/\/$/, "")
  const selfUrlNormalized = new URL(selfUrl).toString().replace(/\/$/, "")

  // Single-pass replacement for all Ory URLs
  const regex = new RegExp(
    escapeRegExp(baseUrlNormalized) + "(/[^\"'\\s]*)?",
    "g",
  )

  return source.replace(regex, (match, path) => {
    // OAuth2 paths must stay on Ory's domain
    if (path && oauth2Paths.some((p) => path.startsWith(p))) {
      return match
    }

    // Check for UI path overrides from config
    for (const [uiPath, configUrl] of Object.entries(uiPathMappings)) {
      if (path && configUrl && path.startsWith(uiPath)) {
        return path.replace(uiPath, new URL(configUrl, selfUrl).toString())
      }
    }

    // Default: rewrite to app's URL
    return selfUrlNormalized + (path || "")
  })
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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
  // Handle null/undefined input to prevent runtime errors
  if (!obj) {
    return obj
  }
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
