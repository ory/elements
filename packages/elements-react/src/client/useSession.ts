// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"

import { useContext } from "react"
import { SessionContext } from "./session-provider"

/**
 * A hook to get the current session from the Ory Network.
 *
 * Usage:
 * ```ts
 * const session = useSession()
 *
 * if (session.state == "loading") {
 *  return <div>Loading...</div>
 * }
 *
 * if (session.state == "authenticated") {
 *  return <div>Session: {session.session.id}</div>
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
    throw new Error("[Ory/Elements] useSession must be used on the client")
  }
  return useContext(SessionContext)
}
