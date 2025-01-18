// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RecoveryFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { OryConfigForNextJS } from "../utils/config"

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
 *   const config = enhanceConfig(baseConfig)
 *   const flow = await getRecoveryFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Recovery
 *       flow={flow}
 *       config={config}
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
 * @param config - The Ory configuration object.
 * @param params - The query parameters of the request.
 */
export async function getRecoveryFlow(
  config: OryConfigForNextJS,
  params: QueryParams | Promise<QueryParams>,
): Promise<RecoveryFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient.getRecoveryFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Recovery,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.recovery_ui_url,
  )
}
