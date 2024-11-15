// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RegistrationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlow } from "./flow"
import { toFlowParams } from "./utils"

/**
 * Use this method in an app router page to fetch an existing registration flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { Registration } from "@ory/elements-react/theme"
 * import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"
 * import { enhanceConfig } from "@ory/nextjs"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/registration/card-header"
 *
 * export default async function RegistrationPage(props: OryPageParams) {
 *   const flow = await getRegistrationFlow(props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Registration
 *       flow={flow}
 *       config={enhanceConfig(config)}
 *       components={{
 *         Card: {
 *           Header: CardHeader,
 *         },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param params The query parameters of the request.
 */
export async function getRegistrationFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<RegistrationFlow | null | void> {
  const p = await toFlowParams(await params)
  return getFlow(
    params,
    () => serverSideFrontendClient.getRegistrationFlowRaw(p, initOverrides),
    FlowType.Registration,
  )
}
