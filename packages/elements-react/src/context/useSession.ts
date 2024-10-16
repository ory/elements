// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { create, useStore } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useEffect } from "react"
import { LogoutFlow, Session } from "@ory/client-fetch"
import { useOryFlow } from "./flow-context"
import { frontendClient } from "../util/client"

type SessionStore = {
  setIsLoading: (loading: boolean) => void
  setSession: (session: Session) => void
  clearSession: () => void
  isLoading?: boolean
  session?: Session
  logoutFlow?: LogoutFlow
  setLogoutFlow: (flow: LogoutFlow) => void
}

export const useSessionStore = create<SessionStore>()(
  subscribeWithSelector((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    session: undefined,
    setSession: (session: Session) => set({ session }),
    clearSession: () => set({ session: undefined }),
    logoutFlow: undefined,
    setLogoutFlow: (logoutFlow: LogoutFlow) => set({ logoutFlow }),
  })),
)

export const useSession = () => {
  const { config } = useOryFlow()
  const store = useStore(useSessionStore)

  useEffect(() => {
    const { session, isLoading, setSession, setIsLoading, setLogoutFlow } =
      useSessionStore.getState()

    if (session ?? isLoading) {
      return
    }

    setIsLoading(true)

    void Promise.all([
      frontendClient(config.sdk.url)
        .toSession()
        .then((session) => {
          setSession(session)
        }),
      frontendClient(config.sdk.url)
        .createBrowserLogoutFlow()
        .then((flow) => {
          console.log("flow", flow)
          setLogoutFlow(flow)
        }),
    ]).finally(() => {
      setIsLoading(false)
    })
  }, [store.session, store.isLoading, config.sdk.url])

  return { session: store.session, logoutFlow: store.logoutFlow }
}
