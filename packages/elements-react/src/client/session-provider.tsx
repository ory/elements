// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { Session } from "@ory/client-fetch"
import { createContext, useCallback, useEffect, useRef, useState } from "react"
import { frontendClient } from "./frontendClient"

type SessionState =
  | {
      session: Session
      state: "authenticated"
    }
  | {
      state: "unauthenticated"
    }
  | {
      state: "error"
      error: Error
    }

/**
 * Holds the session context data.
 * This context is used to provide the session data to the children of the provider.
 * It is used by the {@link useSession} hook to access the session data.
 */
export type SessionContextData = {
  /**
   * Whether the session is currently being loaded
   */
  isLoading: boolean
  /**
   * Whether the session is being loaded for the first time
   * Never true, if a session was passed to the provider
   */
  initialized: boolean
  /**
   * The current session or null if the user is not authenticated or an error occurred,
   * when fetching the session
   */
  session: Session | null
  /**
   * The error that occurred when fetching the session if any
   */
  error: Error | undefined
  /**
   * Refetches the session
   */
  refetch: () => Promise<void>
}

export const SessionContext = createContext<SessionContextData>({
  session: null,
  isLoading: false,
  initialized: false,
  error: undefined,
  refetch: async () => {},
})

export type SessionProviderProps = {
  session?: Session | null
  baseUrl?: string
} & React.PropsWithChildren

/**
 * A provider that fetches the session from the Ory Network and provides it to the children.
 *
 * To use this provider, wrap your application in it:
 *
 * ```tsx
 * import { SessionProvider } from "@ory/elements-react"
 *
 * export default function App() {
 *   return (
 *     <SessionProvider>
 *       <MyApp />
 *     </SessionProvider>
 *   )
 * }
 * ```
 *
 * If you have a session from the server, you can pass it to the provider:
 *
 * ```tsx
 * <SessionProvider session={serverSession}>
 * ```
 *
 * @see {@link useSession}
 * @param props - The provider props
 */
export function SessionProvider({
  session: initialSession,
  children,
  baseUrl,
}: SessionProviderProps) {
  const initialized = useRef(!!initialSession)
  const [isLoading, setLoading] = useState(false)
  const [sessionState, setSessionState] = useState<SessionState | undefined>(
    () => {
      if (initialSession) {
        return {
          session: initialSession,
          state: initialSession.active ? "authenticated" : "unauthenticated",
        }
      }

      return undefined
    },
  )

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true)
      const session = await frontendClient({
        forceBaseUrl: baseUrl,
      }).toSession()

      setSessionState({
        session,
        state: session.active ? "authenticated" : "unauthenticated",
      })
    } catch (error) {
      setSessionState({ state: "error", error: error as Error })
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      void fetchSession()
    }
  }, [fetchSession])

  return (
    <SessionContext.Provider
      value={{
        error: sessionState?.state === "error" ? sessionState.error : undefined,
        session:
          sessionState?.state === "authenticated" ? sessionState.session : null,
        isLoading,
        initialized: initialized.current,
        refetch: fetchSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
