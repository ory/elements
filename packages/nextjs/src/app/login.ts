// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { redirect, RedirectType } from "next/navigation"
import { FlowType, handleFlowError, LoginFlow } from "@ory/client-fetch"

import { getPublicUrl, onRedirect } from "./utils"
import { initOverrides, QueryParams } from "../types"
import { toFlowParams } from "./utils"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { onValidationError } from "../utils/utils"
import { rewriteJsonResponse } from "../utils/rewrite"
import { serverSideFrontendClient } from "./client"

// const factory = getFlowFactory({
//   redirectToBrowserEndpoint,
//   onRedirect,
//   toFlowParams,
//   flowType: FlowType.Login,
//   fetchFlow: newOryFrontendClient().getLoginFlowRaw,
// })

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { useLoginFlow, newFrontendClient } from "@ory/nextjs"
 * import { Login } from "@ory/elements/headless/flows/login"
 *
 * const client = newFrontendClient()
 *
 * export default async function LoginPage({ searchParams }: PageProps) {
 *   const flow = await useLoginFlow(searchParams, client)
 *
 *   return (
 *     <Login
 *       flow={flow}
 *       config={{
 *         name: "My Project",
 *         sdk: { url: "https://${project.slug}.projects.oryapis.com" },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param params The query parameters of the request.
 */
export async function getLoginFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<LoginFlow | null | void> {
  const p = await params

  // Guess our own public url using Next.js helpers. We need the hostname, port, and protocol.
  const knownProxiedUrl = await getPublicUrl()

  const onRestartFlow = () => {
    return redirect(
      new URL(
        "/self-service/" +
          FlowType.Login.toString() +
          "/browser?" +
          params.toString(),
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl,
        }),
      ).toString(),
      RedirectType.replace,
    )
  }

  if (!p["flow"]) {
    onRestartFlow()
    return
  }

  try {
    const resp = await serverSideFrontendClient.getLoginFlowRaw(
      await toFlowParams(p),
      initOverrides,
    )

    return await resp
      .value()
      .then((v) =>
        rewriteJsonResponse(
          v,
          guessPotentiallyProxiedOrySdkUrl({ knownProxiedUrl }),
        ),
      )
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect: onRedirect,
    })
    await errorHandler(error)
    return null
  }
}
