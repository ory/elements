// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { LogoutFlow } from "@ory/client-fetch"
import { createLogoutFlow } from "@ory/ssr"

import { headers } from "next/headers"
import { orySdkUrl } from "../utils/sdk"
import { getOryBaseUrl } from "./ory-url"

/**
 * Use this method in an app router page to create a new logout flow. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { getLogoutFlow } from "@ory/nextjs/app"
 *
 * async function LogoutLink() {
 *   const flow = await getLogoutFlow()
 *
 *   return (
 *     <a href={flow.logout_url}>
 *       Logout
 *     </a>
 *   )
 * }
 *
 * ```
 *
 * @param params - The query parameters of the request.
 * @public
 */
export async function getLogoutFlow({
  returnTo,
}: { returnTo?: string } = {}): Promise<LogoutFlow> {
  const url = await getOryBaseUrl()
  return createLogoutFlow(
    { headers: await headers() },
    { sdkUrl: orySdkUrl(), baseUrl: url, returnTo },
  )
}
