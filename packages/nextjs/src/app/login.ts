// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { onRedirect, redirectToBrowserEndpoint } from "./utils"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import { QueryParams } from "../types"
import { toFlowParams } from "./utils"
import { getFlowFactory } from "./flow"
import { newOryFrontendClient } from "../sdk"

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
  return factory(params)
}
