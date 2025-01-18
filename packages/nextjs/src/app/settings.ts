// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, SettingsFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { OryConfigForNextJS } from "../utils/config"

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { Login } from "@ory/elements-react/theme"
 * import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
 * import { enhanceConfig } from "@ory/nextjs"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/login/card-header"
 *
 * export default async function LoginPage(props: OryPageParams) {
 *   const config = enhanceConfig(baseConfig)
 *   const flow = await getLoginFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Login
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
export async function getSettingsFlow(
  config: OryConfigForNextJS,
  params: QueryParams | Promise<QueryParams>,
): Promise<SettingsFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient.getSettingsFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Settings,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.settings_ui_url,
  )
}
