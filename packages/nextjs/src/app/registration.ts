// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, RegistrationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"
import { useRouter } from "next/router"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"

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
 * @param params - The query parameters of the request.
 */
export async function getRegistrationFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<RegistrationFlow | null | void> {
  const router = useRouter()
  const currentRoute = router.pathname
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient.getRegistrationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Registration,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    currentRoute,
  )
}
