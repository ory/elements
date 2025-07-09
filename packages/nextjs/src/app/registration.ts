// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RegistrationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing registration flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Registration } from "@ory/elements-react/theme"
 * import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/registration/card-header"
 *
 * export default async function RegistrationPage(props: OryPageParams) {
 *   const flow = await getRegistrationFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Registration
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
export async function getRegistrationFlow(
  config: { project: { registration_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<RegistrationFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getRegistrationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Registration,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.registration_ui_url,
  )
}
