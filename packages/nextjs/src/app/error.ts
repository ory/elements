// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { QueryParams } from "src/types"
import { serverSideFrontendClient } from "./client"
import { FlowError } from "@ory/client-fetch"

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
  const params = await searchParams
  if ("error" in params) {
    return {
      error: params["error"] as string,
      error_description:
        (params["error_description"] as string | undefined) ??
        "An unknown error occurred.",
    }
  }

  const id = params["id"]?.toString() ?? ""
  if (!id) {
    return {
      error: "unknown_error",
      error_description: "An unknown error occurred.",
    }
  }

  try {
    return await serverSideFrontendClient().getFlowError({ id })
  } catch (error) {
    return {
      error: "unknown_error",
      error_description:
        error instanceof Error ? error.message : "An unknown error occurred.",
    }
  }
}
