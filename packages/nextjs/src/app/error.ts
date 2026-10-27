// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { QueryParams } from "src/types"
import { serverSideFrontendClient } from "./client"
import { FlowError } from "@ory/client-fetch"
import { resolveError } from "@ory/ssr"
import { getOryBaseUrl } from "./ory-url"

/**
 * Use this method in an app router page to fetch an error from the Ory SDK. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Error as ErrorComponent } from "@ory/elements-react/theme"
 * import "@ory/elements-react/theme/styles.css"
 * import { getError, getServerSession, OryPageParams } from "@ory/nextjs/app"

 * import config from "@/ory.config"

 * export default async function ErrorPage(props: OryPageParams) {
 *   const error = await getError(props.searchParams)
 *   const session = await getServerSession().catch(() => null)
 *
 *   return (
 *     <ErrorComponent
 *       error={error}
 *       config={config}
 *       components={{ Card: {} }}
 *       session={session ?? undefined}
 *     />
 *   )
 * }
 * ```
 *
 * @param searchParams - the query params of the request. This can be either the search params from the app router or a promise that resolves to the search params. The promise is useful if you want to fetch the search params from a different source, such as a cookie or a header.
 * @returns An object containing the error and error description, or a FlowError object if the error is a flow error. If the error is not a flow error, the error description will be "An unknown error occurred.".
 * @public
 */
export async function getError(
  searchParams: QueryParams | Promise<QueryParams>,
): Promise<{ error: string; error_description: string } | FlowError> {
  return resolveError(
    await searchParams,
    (params) => serverSideFrontendClient().getFlowError(params),
    { baseUrl: await getOryBaseUrl() },
  )
}
