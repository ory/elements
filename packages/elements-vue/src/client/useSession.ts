// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Session } from "@ory/client-fetch"
import {
  inject,
  provide,
  ref,
  readonly,
  type InjectionKey,
  type Ref,
  type DeepReadonly,
} from "vue"
import { frontendClient } from "../util/client"

/**
 * Session context data provided by SessionProvider
 */
export interface SessionContextData {
  /**
   * Whether the session is currently being loaded
   */
  isLoading: Readonly<Ref<boolean>>
  /**
   * Whether the session has been initialized (first fetch completed)
   */
  initialized: Readonly<Ref<boolean>>
  /**
   * The current session or null if not authenticated
   */
  session: DeepReadonly<Ref<Session | null>>
  /**
   * Error that occurred when fetching the session, if any
   */
  error: DeepReadonly<Ref<Error | undefined>>
  /**
   * Refetch the session from the server
   */
  refetch: () => Promise<void>
}

const SessionKey: InjectionKey<SessionContextData> = Symbol("OrySession")

export interface SessionProviderOptions {
  /**
   * Initial session from server-side rendering
   */
  session?: Session | null
  /**
   * Base URL for the Ory SDK (defaults to window.location.origin)
   */
  baseUrl?: string
}

/**
 * Provides session context to child components.
 *
 * Call this in your root component's setup function:
 *
 * @example
 * ```vue
 * <script setup>
 * import { provideSession } from "@ory/elements-vue/client"
 *
 * // With initial session from SSR
 * provideSession({ session: serverSession })
 *
 * // Or let it fetch on mount
 * provideSession()
 * </script>
 * ```
 *
 * @param options - Provider options
 * @returns The session context data
 */
export function provideSession(
  options: SessionProviderOptions = {},
): SessionContextData {
  const { session: initialSession, baseUrl } = options

  // Check if session was explicitly provided (even as null)
  const sessionProvided = "session" in options

  const isLoading = ref(false)
  // If session was explicitly provided (including null), we're initialized
  const initialized = ref(sessionProvided)
  const session = ref<Session | null>(initialSession ?? null)
  const error = ref<Error | undefined>(undefined)

  const fetchSession = async () => {
    try {
      isLoading.value = true
      error.value = undefined

      const sdkUrl =
        baseUrl ?? (typeof window !== "undefined" ? window.location.origin : "")
      const client = frontendClient(sdkUrl)
      const fetchedSession = await client.toSession()

      session.value = fetchedSession
    } catch (err) {
      session.value = null
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      isLoading.value = false
      initialized.value = true
    }
  }

  // Auto-fetch only if session was NOT explicitly provided
  if (!sessionProvided && typeof window !== "undefined") {
    void fetchSession()
  }

  const context: SessionContextData = {
    isLoading: readonly(isLoading),
    initialized: readonly(initialized),
    session: readonly(session),
    error: readonly(error),
    refetch: fetchSession,
  }

  provide(SessionKey, context)

  return context
}

/**
 * Access the session context from any child component.
 *
 * Must be used within a component tree where `provideSession` has been called.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useSession } from "@ory/elements-vue/client"
 *
 * const { session, isLoading, error, refetch } = useSession()
 * </script>
 *
 * <template>
 *   <div v-if="isLoading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <div v-else-if="session">Welcome, {{ session.identity?.traits?.email }}</div>
 *   <div v-else>Not authenticated</div>
 * </template>
 * ```
 *
 * @returns The session context data
 * @throws Error if used outside of a SessionProvider
 */
export function useSession(): SessionContextData {
  const context = inject(SessionKey)

  if (!context) {
    throw new Error(
      "[Ory/Elements] useSession must be used within a component where provideSession has been called",
    )
  }

  return context
}
