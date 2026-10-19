// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"

import { useContext } from "react"
import { SessionContext } from "./session-provider"

/**
 * A hook to get the current session from the Ory Network.
 *
 * Usage:
 * ```tsx
 * const { session, isLoading } = useSession()
 *
 * if (isLoading) {
 *  return <div>Loading...</div>
 * }
 *
 * if (session) {
 *  return <div>Session: {session.id}</div>
 * }
 * ```
 *
 * :::note
 * This is a client-side hook and must be used within a React component.
 * On the server, you can use the getServerSession function from `@ory/nextjs`
 * and hydrate SessionProvider with the session.
 * :::
 *
 * @returns The current session, and error or loading state.
 */

export function useSession() {
  if (!SessionContext) {
    throw new Error(
      '[@ory/elements-react] useSession must be used on the client. Add the "use client" directive to the file that calls it and wrap the tree in <SessionProvider> from `@ory/elements-react/client`. On the server, use getServerSession from `@ory/nextjs/app`.',
    )
  }
  return useContext(SessionContext)
}
