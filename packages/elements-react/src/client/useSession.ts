// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"

import { Session } from "@ory/client-fetch"
import { useCallback, useEffect } from "react"
import { create, useStore } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { frontendClient } from "./frontendClient"

type SessionStore = {
  setIsLoading: (loading: boolean) => void
  setSession: (session: Session) => void
  isLoading: boolean
  session: Session | undefined
  error: string | undefined
  setError: (error: string | undefined) => void
}

export const sessionStore = create<SessionStore>()(
  subscribeWithSelector((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    session: undefined,
    setSession: (session: Session) => set({ session }),
    error: undefined,
    setError: (error: string | undefined) => set({ error }),
  })),
)

/**
 * A hook to get the current session from the Ory Network.
 *
 * Usage:
 * ```ts
 * const { session, error, isLoading } = useSession()
 * ```
 *
 * @returns The current session, error and loading state.
 */
export const useSession = (config: { orySdkUrl?: string } = {}) => {
  const store = useStore(sessionStore)

  const fetchSession = useCallback(async () => {
    const client = frontendClient({
      forceBaseUrl: config.orySdkUrl,
    })
    const { session, isLoading, setSession, setIsLoading, setError } =
      sessionStore.getState()

    if (!!session || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const sessionData = await client.toSession()
      setSession(sessionData)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error occurred")
      if (!config?.orySdkUrl) {
        console.error(
          "Could not fetch session. Make sure you have set your environment variables correctly.",
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [config?.orySdkUrl])

  useEffect(() => {
    void fetchSession()
  }, [fetchSession])

  return {
    session: store.session,
    error: store.error,
    isLoading: store.isLoading,
  }
}
