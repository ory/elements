// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"
import { useEffect, useState } from "react"
import { clientSideFrontendClient } from "./client"

/**
 * A client-side hook to fetch the current user session.
 *
 * @example
 * ```tsx
 * import { useSession } from "@ory/nextjs/pages"
 *
 * export default function ProfilePage() {
 *   const { session, loading, error } = useSession()
 *
 *   if (loading) {
 *     return <div>Loading...</div>
 *   }
 *
 *   if (error || !session) {
 *     return <div>Not logged in</div>
 *   }
 *
 *   return <div>Hello {session.identity?.traits?.email}</div>
 * }
 * ```
 *
 * @returns The session object, loading state, and error if any.
 * @public
 * @function
 * @group Hooks
 */
export function useSession(): {
  session: Session | null
  loading: boolean
  error: Error | null
} {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    clientSideFrontendClient()
      .toSession()
      .then((session) => {
        setSession(session)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { session, loading, error }
}
