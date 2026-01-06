// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ref, onMounted } from "vue"
import type { LogoutFlow } from "@ory/client-fetch"
import { frontendClient } from "../../../util/client"

/**
 * Composable to handle client-side logout flow
 */
export function useClientLogout(config: { sdk: { url: string } }) {
  const logoutFlow = ref<LogoutFlow | undefined>()
  const isLoading = ref(true)

  async function fetchLogoutFlow() {
    try {
      const flow = await frontendClient(config.sdk.url)
        .createBrowserLogoutFlow()
        .catch((err) => {
          // We ignore errors that are thrown because the user is not signed in.
          if (err.response?.status !== 401) {
            throw err
          }
          return undefined
        })
      logoutFlow.value = flow
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void fetchLogoutFlow()
  })

  return { logoutFlow, didLoad: () => !isLoading.value }
}
