// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { FlowType, VerificationFlow } from "@ory/client-fetch"

import { initOverrides, QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getFlow } from "./flow"
import { toFlowParams } from "./utils"

/**
 * Use this method in an app router page to fetch an existing verification flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { Verification } from "@ory/elements-react/theme"
 * import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app"
 * import { enhanceConfig } from "@ory/nextjs"
 *
 * import config from "@/ory.config"
 * import CardHeader from "@/app/auth/verification/card-header"
 *
 * export default async function VerificationPage(props: OryPageParams) {
 *   const flow = await getVerificationFlow(props.searchParams)
 *
 *   if (!flow) {
 *     return null
 *   }
 *
 *   return (
 *     <Verification
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
export async function getVerificationFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<VerificationFlow | null | void> {
  const p = await toFlowParams(await params)
  return getFlow(
    params,
    () => serverSideFrontendClient.getVerificationFlowRaw(p, initOverrides),
    FlowType.Verification,
  )
}
