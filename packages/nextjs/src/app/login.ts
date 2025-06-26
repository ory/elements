// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, LoginFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Login } from "@ory/elements-react/theme"
 * import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"
 * import CardHeader from "@/app/auth/login/card-header"
 *
 * import config from "@/ory.config"
 *
 * export default async function LoginPage(props: OryPageParams) {
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
 * @public
 */
export async function getLoginFlow(
  config: { project: { login_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<LoginFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getLoginFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Login,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.login_ui_url,
  )
}
