// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { rewriteJsonResponse as rewriteJson } from "@ory/ssr"
import { orySdkUrl } from "./sdk"

export { rewriteUrls } from "@ory/ssr/proxy"

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
  return rewriteJson(
    obj,
    proxyUrl ? { from: orySdkUrl(), to: proxyUrl } : undefined,
  )
}
