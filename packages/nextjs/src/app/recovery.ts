// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getOryBaseUrl } from "./ory-url"
import { toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing recovery flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Recovery } from "@ory/elements-react/theme"
 * import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app"
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/recovery/card-header"
 *
 * export default async function RecoveryPage(props: OryPageParams) {
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
 * @public
 */
export async function getRecoveryFlow(
  config: { project: { recovery_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RecoveryFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getRecoveryFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Recovery,
    await getOryBaseUrl(),
    config.project.recovery_ui_url,
  )
}
