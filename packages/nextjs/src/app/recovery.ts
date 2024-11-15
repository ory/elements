// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RecoveryFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlow } from "./flow"
import { toFlowParams } from "./utils"

/**
 * Use this method in an app router page to fetch an existing recovery flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { Recovery } from "@ory/elements-react/theme"
 * import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"
 * import { enhanceConfig } from "@ory/nextjs"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/recovery/card-header"
 *
 * export default async function RecoveryPage(props: OryPageParams) {
 *   const flow = await getRecoveryFlow(props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Recovery
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
export async function getRecoveryFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<RecoveryFlow | null | void> {
  const p = await toFlowParams(await params)
  return getFlow(
    params,
    () => serverSideFrontendClient.getRecoveryFlowRaw(p, initOverrides),
    FlowType.Recovery,
  )
}
