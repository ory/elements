// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use server"
import { redirectToBrowserEndpoint, onRedirect } from "./utils"
import { RegistrationFlow, FlowType } from "@ory/client-fetch"
import { QueryParams } from "../types"
import { toFlowParams } from "./utils"
import { getFlowFactory } from "./flow"
import { newOryFrontendClient } from "../sdk"

const factory = getFlowFactory({
  redirectToBrowserEndpoint,
  onRedirect,
  toFlowParams,
  flowType: FlowType.Registration,
  fetchFlow: newOryFrontendClient().getRegistrationFlowRaw,
})

/**
 * Use this method in an app router page to fetch an existing registration flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { useRegistrationFlow, newFrontendClient } from "@ory/nextjs"
 * import { Registration } from "@ory/elements/headless/flows/registration"
 *
 * const client = newFrontendClient()
 *
 * export default async function RegistrationPage({ searchParams }: PageProps) {
 *   const flow = await useRegistrationFlow(searchParams, client)
 *
 *   return (
 *     <Registration
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
export async function getRegistrationFlow(
  params: QueryParams,
): Promise<RegistrationFlow | null | void> {
  return factory(params)
}
