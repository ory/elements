// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import type { Ref } from "vue"
import {
  Session,
  AuthenticatorAssuranceLevel,
  ResponseError,
} from "@ory/client-fetch"
import { useRequestHeaders, useFetch, useAsyncData } from "#imports"
import { createFrontendClient } from "../utils/sdk"

/**
 * Session result with additional AAL information
 */
export interface OrySessionResult {
  /** The session if authenticated, null otherwise */
  session: Session | null
  /** Whether AAL2 (2FA) is required to access protected resources */
  requiresAal2: boolean
  /** The current AAL level if session exists */
  aal?: AuthenticatorAssuranceLevel
}

/**
 * Checks if the error response indicates AAL2 is required.
 */
async function checkAal2Required(error: unknown): Promise<boolean> {
  if (!(error instanceof ResponseError)) {
    return false
  }

  try {
    const body = await error.response.clone().json()
    return body?.error?.id === "session_aal2_required"
  } catch {
    return false
  }
}

/**
 * Get the current Ory session on the server side
 *
 * Uses useAsyncData with server: true to ensure the session is only
 * fetched on the server and hydrated to the client without re-fetching.
 *
 * The result includes information about whether AAL2 is required.
 *
 * @example
 * ```vue
 * <script setup>
 * const { data: sessionResult } = await useOrySession()
 *
 * if (!sessionResult.value?.session) {
 *   if (sessionResult.value?.requiresAal2) {
 *     // User has session but needs 2FA
 *     navigateTo('/auth/login?aal=aal2')
 *   } else {
 *     // No session at all
 *     navigateTo('/auth/login')
 *   }
 * }
 * </script>
 * ```
 */
export async function useOrySession(): Promise<{
  data: Ref<OrySessionResult | null>
}> {
  const { data } = await useAsyncData(
    "ory-session",
    async (): Promise<OrySessionResult> => {
      const headers = useRequestHeaders(["cookie"])
      const cookie = headers.cookie

      try {
        const frontend = createFrontendClient()
        const session = await frontend.toSession({ cookie })
        return {
          session,
          requiresAal2: false,
          aal: session.authenticator_assurance_level,
        }
      } catch (error) {
        // Check if this is an AAL2 requirement error
        const requiresAal2 = await checkAal2Required(error)
        return {
          session: null,
          requiresAal2,
        }
      }
    },
    {
      server: true,
      lazy: false,
    },
  )

  return { data }
}

/**
 * Fetch the current session using useFetch (auto-refreshes)
 */
export function useAsyncOrySession() {
  return useFetch<Session | null>("/sessions/whoami", {
    key: "ory-session",
    default: () => null,
  })
}
