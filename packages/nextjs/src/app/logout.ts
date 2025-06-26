// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { LogoutFlow } from "@ory/client-fetch"

import { headers } from "next/headers"
import { rewriteJsonResponse } from "../utils/rewrite"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getPublicUrl } from "./utils"

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
  const h = await headers()

  const knownProxiedUrl = await getPublicUrl()
  const url = guessPotentiallyProxiedOrySdkUrl({
    knownProxiedUrl,
  })
  return serverSideFrontendClient()
    .createBrowserLogoutFlow({
      cookie: h.get("cookie") ?? "",
      returnTo,
    })
    .then((v: LogoutFlow): LogoutFlow => rewriteJsonResponse(v, url))
}
