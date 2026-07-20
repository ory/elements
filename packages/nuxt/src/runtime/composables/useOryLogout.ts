// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */

import type { Ref } from "vue"
import type { LogoutFlow } from "@ory/client-fetch"
import { useRequestHeaders, useAsyncData, useRequestURL } from "#imports"
import { createFrontendClient, orySdkUrl } from "../utils/sdk"
import { rewriteJsonResponse } from "../utils/rewrite"

/**
 * Get the logout flow URL for the current session
 *
 * Fetches the logout flow and rewrites URLs to go through the app's proxy.
 * Works on both SSR and client-side navigation.
 *
 * @param options - Optional configuration
 * @param options.returnTo - URL to redirect to after logout
 *
 * @example
 * ```vue
 * <script setup>
 * const { data: logoutFlow } = await useOryLogout()
 * </script>
 *
 * <template>
 *   <NuxtLink v-if="logoutFlow" :to="logoutFlow.logout_url" external>
 *     Logout
 *   </NuxtLink>
 * </template>
 * ```
 */
export async function useOryLogout(options?: {
  returnTo?: string
}): Promise<{ data: Ref<LogoutFlow | null> }> {
  // Get these values at the top level before any async operations
  // to preserve the Nuxt context
  const sdkUrl = orySdkUrl()
  const requestUrl = useRequestURL()
  const publicUrl = requestUrl.origin

  const { data } = await useAsyncData(
    "ory-logout",
    async () => {
      const headers = useRequestHeaders(["cookie"])
      const cookie = headers.cookie

      try {
        const frontend = createFrontendClient()
        const flow = await frontend.createBrowserLogoutFlow({
          cookie,
          returnTo: options?.returnTo,
        })

        // Rewrite URLs to go through the app's proxy
        return rewriteJsonResponse(flow, sdkUrl, publicUrl)
      } catch {
        // User is not logged in or session is invalid
        return null
      }
    },
    {
      server: true,
      lazy: false,
    },
  )

  return { data }
}
