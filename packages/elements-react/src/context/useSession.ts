// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { create, useStore } from "zustand"
import { useEffect } from "react"
import { Session } from "@ory/client-fetch"
import { useOryFlow } from "./flow-context"
import { frontendClient } from "../util/client"

type SessionStore = {
  setIsLoading: (loading: boolean) => void
  setSession: (session: Session) => void
  clearSession: () => void
  isLoading?: boolean
  session?: Session
}

export const useSessionStore = create<SessionStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  session: undefined,
  setSession: (session: Session) => set({ session }),
  clearSession: () => set({ session: undefined }),
}))

export const useSession = () => {
  const { config } = useOryFlow()
  const store = useStore(useSessionStore)

  useEffect(() => {
    const { session, isLoading, setSession, setIsLoading } =
      useSessionStore.getState()

    if (session ?? isLoading) {
      return
    }

    setIsLoading(true)

    void frontendClient(config.sdk.url)
      .toSession()
      .then((session) => {
        setSession(session)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [store.session, store.isLoading, config.sdk.url])

  return store.session
}
