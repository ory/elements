// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"
import { create, useStore } from "zustand"
import { frontendClient } from "../util/client"
import { useOryFlow } from "./flow-context"
import { useEffect } from "react"

type SessionStore = {
  isLoading?: boolean
  setLoading: (loading: boolean) => void
  session?: Session
  setSession: (session: Session) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  session: undefined,
  setSession: (session: Session) => set({ session }),
  clearSession: () => set({ session: undefined }),
}))

export const useSession = () => {
  const { config } = useOryFlow()
  const store = useStore(useSessionStore)

  useEffect(() => {
    if (
      useSessionStore.getState().session ??
      useSessionStore.getState().isLoading
    ) {
      return
    }

    store.setLoading(true)

    void frontendClient(config.sdk.url)
      .toSession()
      .then((session) => {
        useSessionStore.getState().setSession(session)
      })
      .finally(() => {
        useSessionStore.getState().setLoading(false)
      })
  }, [store.session, store.isLoading, config.sdk.url])

  return store.session
}
