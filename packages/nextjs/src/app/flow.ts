// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { redirect, RedirectType } from "next/navigation"
import { FlowType, ApiResponse } from "@ory/client-fetch"
import { resolveFlow } from "@ory/ssr"

import { QueryParams } from "../types"
import { rewriteJsonResponse } from "../utils/rewrite"

function warnOnMissingFlow(
  flow: unknown,
  flowType: FlowType,
  flowId: string | string[],
) {
  if (flow) {
    return
  }
  console.warn(
    `[@ory/nextjs] No ${flowType} flow was returned for flow ID "${flowId.toString()}". A page that returns \`null\` for a missing flow renders blank. Check that \`NEXT_PUBLIC_ORY_SDK_URL\` is the URL of your Ory project and that \`middleware.ts\` exports the middleware from \`@ory/nextjs/middleware\`. See https://www.ory.com/docs/getting-started/integrate-auth/nextjs-app-router-quickstart`,
  )
}

/**
 * A function that creates a flow fetcher. The flow fetcher can be used
 * to fetch a login, registration, recovery, settings, or verification flow
 * from the SDK.
 *
 * Unless you are building something very custom, you will not need this method. Use it with care and expect
 * potential breaking changes.
 *
 * @param params - The query parameters of the request.
 * @param fetchFlowRaw - A function that fetches the flow from the SDK.
 * @param flowType - The type of the flow.
 * @param baseUrl - The URL the browser uses to reach Ory, from `getOryBaseUrl`.
 * @param route - The route of the application.
 * @param options - Additional options.
 * @public
 */
export async function getFlowFactory<T extends object>(
  params: QueryParams,
  fetchFlowRaw: () => Promise<ApiResponse<T>>,
  flowType: FlowType,
  baseUrl: string,
  route: string,
  options: {
    disableRewrite?: boolean
  } = { disableRewrite: false },
): Promise<T | null | void> {
  const result = await resolveFlow(flowType, params, fetchFlowRaw, {
    baseUrl,
    route,
    transform: options.disableRewrite
      ? undefined
      : (flow) => rewriteJsonResponse(flow, baseUrl),
    onRawResponseError: (err) => {
      // eslint-disable-next-line no-console
      console.warn(
        "[@ory/nextjs] Failed to read the raw flow response. Select fields from `enum` constraints in the identity schema may render as plain inputs.",
        err,
      )
    },
  })

  if ("redirectTo" in result) {
    return result.restart
      ? redirect(result.redirectTo, RedirectType.replace)
      : redirect(result.redirectTo)
  }

  warnOnMissingFlow(result.flow, flowType, params["flow"] ?? "")
  return result.flow
}
