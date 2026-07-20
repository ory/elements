// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { frontendClient } from "./client"

export interface GetLogoutUrlOptions {
  /**
   * The Ory SDK URL (e.g., https://your-project.projects.oryapis.com)
   */
  sdkUrl: string
  /**
   * Optional headers to forward (e.g., cookies for SSR)
   */
  headers?: Record<string, string>
}

/**
 * Fetches the logout URL from Ory.
 * Can be used in SSR context by passing cookies in headers.
 *
 * @example
 * // Client-side usage
 * const logoutUrl = await getLogoutUrl({ sdkUrl: 'https://...' })
 *
 * @example
 * // Nuxt SSR usage
 * const headers = useRequestHeaders(['cookie'])
 * const logoutUrl = await getLogoutUrl({
 *   sdkUrl: config.public.oryUrl,
 *   headers: headers as Record<string, string>
 * })
 */
export async function getLogoutUrl(
  options: GetLogoutUrlOptions,
): Promise<string | null> {
  try {
    const client = frontendClient(options.sdkUrl, {
      headers: options.headers,
    })
    const flow = await client.createBrowserLogoutFlow()
    return flow.logout_url
  } catch (error: unknown) {
    // Ignore 401 errors (user not logged in)
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 401
    ) {
      return null
    }
    // Re-throw other errors
    throw error
  }
}
