// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow, Session } from "@ory/client-fetch"

import { frontendClient, withoutTrailingSlash } from "./client"
import { rewriteJsonResponse } from "./rewrite"
import type { OryRequest } from "./types"

/**
 * Fetches the session of the request's cookies.
 *
 * @param req - The incoming request.
 * @param opts - The Ory SDK URL.
 * @returns The session object or null if no session is found.
 * @public
 */
export async function getSession(
  req: Pick<OryRequest, "headers">,
  opts: { sdkUrl: string },
): Promise<Session | null> {
  return frontendClient(opts.sdkUrl)
    .toSession({
      cookie: req.headers.get("cookie") ?? undefined,
    })
    .catch(() => null)
}

/**
 * Creates a logout flow for the session of the request's cookies. Ory URLs
 * in the flow, including `logout_url`, are rewritten to `baseUrl`.
 *
 * @param req - The incoming request.
 * @param opts - The Ory SDK URL, the browser URL from {@link resolveOryBaseUrl}, and where to return after logout.
 * @returns The logout flow.
 * @public
 */
export async function createLogoutFlow(
  req: Pick<OryRequest, "headers">,
  opts: { sdkUrl: string; baseUrl: string; returnTo?: string },
): Promise<LogoutFlow> {
  const sdkUrl = withoutTrailingSlash(opts.sdkUrl)
  return frontendClient(sdkUrl)
    .createBrowserLogoutFlow({
      cookie: req.headers.get("cookie") ?? "",
      returnTo: opts.returnTo,
    })
    .then(
      (v: LogoutFlow): LogoutFlow =>
        rewriteJsonResponse(v, {
          from: sdkUrl,
          to: withoutTrailingSlash(opts.baseUrl),
        }),
    )
}
