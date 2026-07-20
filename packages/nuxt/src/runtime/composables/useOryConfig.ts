// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useRuntimeConfig, useRequestURL } from "#imports"
import type { AccountExperienceConfiguration } from "@ory/client-fetch"

/**
 * Get the Ory configuration for use with @ory/elements-vue components
 *
 * The SDK URL is set to the current origin so that client-side requests
 * go through the Nuxt server proxy, avoiding CORS issues.
 *
 * @example
 * ```vue
 * <script setup>
 * const config = useOryConfig()
 * const flow = await useOryLoginFlow()
 * </script>
 *
 * <template>
 *   <Login v-if="flow" :flow="flow" :config="config" />
 * </template>
 * ```
 */
export function useOryConfig() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const runtimeConfig = useRuntimeConfig()

  // Use the current origin for SDK URL so requests go through the proxy
  // This avoids CORS issues when making client-side requests
  let sdkUrl = ""
  if (import.meta.client) {
    sdkUrl = window.location.origin
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const requestUrl = useRequestURL()
      sdkUrl = requestUrl.origin
    } catch {
      // Fallback if useRequestURL is not available
      sdkUrl = ""
    }
  }

  return {
    sdk: {
      url: sdkUrl,
    },
    project: runtimeConfig.public.ory
      ?.project as Partial<AccountExperienceConfiguration>,
  }
}
