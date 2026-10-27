// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"
import { getSession } from "@ory/ssr"
import { headers } from "next/headers"
import { orySdkUrl } from "../utils/sdk"

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
  return getSession({ headers: await headers() }, { sdkUrl: orySdkUrl() })
}
