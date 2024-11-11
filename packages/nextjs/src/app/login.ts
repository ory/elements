// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use server"
import { onRedirect, redirectToBrowserEndpoint } from "./utils"
import {
  ApiResponse,
  FlowType,
  handleFlowError,
  LoginFlow,
} from "@ory/client-fetch"
import { FlowParams, initOverrides, QueryParams } from "../types"
import { toFlowParams } from "./utils"
import { getFlowFactory } from "./flow"
import { newOryFrontendClient } from "../sdk"
import { onValidationError, toValue } from "../utils"

const factory = getFlowFactory({
  redirectToBrowserEndpoint,
  onRedirect,
  toFlowParams,
  flowType: FlowType.Login,
  fetchFlow: newOryFrontendClient().getLoginFlowRaw,
})

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
  params: QueryParams,
): Promise<LoginFlow | null | void> {
  const onRestartFlow = () =>
    redirectToBrowserEndpoint(params,FlowType.Login)

  if (!params["flow"]) {
    onRestartFlow()
    return
  }

  try {
    const resp = await newOryFrontendClient().getLoginFlowRaw(
      toFlowParams(params),
      initOverrides,
    )

    return toValue<LoginFlow>(resp)
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
