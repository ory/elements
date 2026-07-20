// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */

/**
 * Rewrite URLs in content from Ory SDK URL to local URL
 */
export function rewriteUrls(
  content: string,
  matchBaseUrl: string,
  selfUrl: string,
): string {
  return content.replaceAll(
    matchBaseUrl.replace(/\/$/, ""),
    selfUrl.replace(/\/$/, ""),
  )
}

/**
 * Rewrites Ory SDK URLs in JSON responses with the provided proxy URL.
 *
 * @param obj - The object to rewrite
 * @param sdkUrl - The Ory SDK URL to replace
 * @param proxyUrl - The proxy URL to replace with
 */
export function rewriteJsonResponse<T extends object>(
  obj: T,
  sdkUrl: string,
  proxyUrl: string,
): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [
            key,
            value
              .map((item) => {
                if (typeof item === "object" && item !== null) {
                  return rewriteJsonResponse(item, sdkUrl, proxyUrl)
                } else if (typeof item === "string") {
                  return item.replaceAll(sdkUrl, proxyUrl)
                }
                return item
              })
              .filter((item) => item !== undefined),
          ]
        } else if (typeof value === "object" && value !== null) {
          return [key, rewriteJsonResponse(value, sdkUrl, proxyUrl)]
        } else if (typeof value === "string") {
          return [key, value.replaceAll(sdkUrl, proxyUrl)]
        }
        return [key, value]
      }),
  ) as T
}
