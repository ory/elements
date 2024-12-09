"use client"
import { Session } from "@ory/client-fetch"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { frontendClient } from "./frontendClient"

type SessionData =
  | {
      session: Session
      state: "authenticated"
    }
  | {
      state: "unauthenticated"
    }
  | {
      state: "loading"
    }
  | {
      state: "error"
      error: Error
    }

const SessionContext = createContext<SessionData>({
  state: "loading",
})

export function useSession() {
  if (!SessionContext) {
    throw new Error("[Ory/Elements] useSession must be used on the client")
  }
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error(
      "[Ory/Elements] useSession must be used within a SessionProvider",
    )
  }
  return session
}
type SessionProviderProps = {
  session?: Session | null
  /**
   * The time in milliseconds after which the session should be considered stale.
   * If the session is stale, the session will be refreshed.
   * If set to Infinity, the session will never be refreshed.
   */
  staleTime?: number
} & React.PropsWithChildren

export function SessionProvider({
  session: initialSession,
  staleTime = Infinity,
  children,
}: SessionProviderProps) {
  const [lastSync, setLastSync] = useState<number>(0)
  const [session, setSession] = useState<SessionData>(() => {
    if (initialSession) {
      return {
        session: initialSession,
        state: initialSession.active ? "authenticated" : "unauthenticated",
      }
    }

    return { state: "unauthenticated" }
  })

  const fetchSession = useCallback(async () => {
    try {
      const session = await frontendClient().toSession()
      setSession({
        session,
        state: session.active ? "authenticated" : "unauthenticated",
      })
      setLastSync(Date.now())
    } catch (error) {
      setSession({ state: "error", error: error as Error })
    }
  }, [])

  const isLoading = session.state === "loading"

  useEffect(() => {
    // If the session is already loaded or we're currently loading it, we don't need to fetch it again
    if (lastSync + staleTime > Date.now() || isLoading) {
      return
    }
    void fetchSession()
  }, [fetchSession, lastSync, staleTime, isLoading])

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}
