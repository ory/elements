// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"
import { serverSideFrontendClient } from "./client"
import { getCookieHeader } from "./utils"

/**
 * A helper to fetch the session on the server side. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { getServerSession } from "@ory/nextjs/app"
 *
 * async function MyComponent() {
 *  const session = await getServerSession()
 *
 *  if (!session) {
 *    return <p>No session found</p>
 *  }
 *
 * }
 * ```
 *
 * @returns The session object or null if no session is found.
 * @public
 */
export async function getServerSession(): Promise<Session | null> {
  const cookie = await getCookieHeader()
  return serverSideFrontendClient()
    .toSession({
      cookie,
    })
    .catch(() => null)
}
