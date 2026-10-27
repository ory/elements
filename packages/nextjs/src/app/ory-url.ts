// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  oryBaseUrlWarning,
  resolveOryBaseUrl,
  type OryBaseUrlReason,
} from "@ory/ssr"
import { headers } from "next/headers"

import { originFromHeaders, proxyStateFromHeaders } from "../utils/ory-url"
import { orySdkUrl } from "../utils/sdk"

const warned = new Set<OryBaseUrlReason>()

/**
 * Returns the URL the browser uses to reach Ory for the current request. The
 * flow functions and `getError` attach it to what they return, so the Ory
 * Elements flow components need no `baseUrl`. Pass it as `baseUrl` to
 * `SessionProvider`, which fetches the session itself.
 *
 * The URL is the request's origin only when the middleware from
 * `@ory/nextjs/middleware` handled the request and the origin is in its
 * `trustedOrigins`. Otherwise it is `NEXT_PUBLIC_ORY_SDK_URL`, and a warning
 * with the fix is logged once when that cannot work.
 *
 * @example
 * ```tsx
 * import { SessionProvider } from "@ory/elements-react/client"
 * import { getOryBaseUrl, getServerSession } from "@ory/nextjs/app"
 *
 * export default async function Layout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <SessionProvider
 *       session={await getServerSession()}
 *       baseUrl={await getOryBaseUrl()}
 *     >
 *       {children}
 *     </SessionProvider>
 *   )
 * }
 * ```
 *
 * @returns The browser URL.
 * @public
 */
export async function getOryBaseUrl(): Promise<string> {
  const h = await headers()
  const opts = {
    sdkUrl: orySdkUrl(),
    origin: originFromHeaders(h),
    proxy: proxyStateFromHeaders(h),
  }
  const resolved = resolveOryBaseUrl(opts)
  const warning = oryBaseUrlWarning(resolved, opts)
  if (warning && !warned.has(resolved.reason)) {
    warned.add(resolved.reason)
    console.warn(`[@ory/nextjs] ${warning}`)
  }
  return resolved.url
}
