// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call */

import { FlowError } from "@ory/client-fetch"
import { useRequestHeaders, useAsyncData } from "#imports"
import { createFrontendClient } from "../utils/sdk"

/**
 * Fetches the flow error details from Ory.
 * This composable runs on the server (SSR) to avoid CORS issues.
 *
 * @param errorId - The error ID from the URL query parameter
 * @returns The flow error details or null if not found
 *
 * @example
 * ```vue
 * <script setup>
 * const route = useRoute()
 * const errorId = route.query.id as string
 * const { data: flowError } = await useOryFlowError(errorId)
 * </script>
 * ```
 */
export async function useOryFlowError(
  errorId: string | undefined,
): Promise<{ data: FlowError | null }> {
  if (!errorId) {
    return { data: null }
  }

  const { data } = await useAsyncData(
    `ory-flow-error-${errorId}`,
    async () => {
      const headers = useRequestHeaders(["cookie"])
      const cookie = headers.cookie

      try {
        const frontend = createFrontendClient()
        const flowError = await frontend.getFlowError({ id: errorId, cookie })
        return flowError
      } catch {
        return null
      }
    },
    {
      server: true,
      lazy: false,
    },
  )

  return { data: data.value }
}
