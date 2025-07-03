// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, VerificationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"
import { serverSideFrontendClient } from "./client"
import { getFlowFactory } from "./flow"
import { getPublicUrl, toGetFlowParameter } from "./utils"

/**
 * Use this method in an app router page to fetch an existing verification flow or to create a new one. This method works with server-side rendering.
 *
 * @example
 * ```tsx
 * import { Verification } from "@ory/elements-react/theme"
 * import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/verification/card-header"
 *
 * export default async function VerificationPage(props: OryPageParams) {
 *   const flow = await getVerificationFlow(config, props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Verification
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
export async function getVerificationFlow(
  config: { project: { verification_ui_url: string } },
  params: QueryParams | Promise<QueryParams>,
): Promise<VerificationFlow | null | void> {
  return getFlowFactory(
    await params,
    async () =>
      serverSideFrontendClient().getVerificationFlowRaw(
        await toGetFlowParameter(params),
        initOverrides,
      ),
    FlowType.Verification,
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: await getPublicUrl(),
    }),
    config.project.verification_ui_url,
  )
}
