// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ApiResponse } from "@ory/client-fetch"
import { FlowParams, QueryParams } from "../types"
import { rewriteJsonResponse } from "./rewrite"

export {
  filterRequestHeaders,
  joinUrlPaths,
  processSetCookieHeaders,
} from "@ory/ssr/proxy"

export function onValidationError<T>(value: T): T {
  return value
}

export async function toFlowParams(
  params: QueryParams,
  getCookieHeader: () => Promise<string | undefined>,
): Promise<FlowParams> {
  return {
    id: params["flow"]?.toString() ?? "",
    cookie: await getCookieHeader(),
    return_to: params["return_to"]?.toString() ?? "",
  }
}

export function toValue<T extends object>(res: ApiResponse<T>): Promise<T> {
  // Remove all undefined values from the response (array and object) using lodash:
  // Remove all (nested) undefined values from the response using lodash
  return res.value().then((v) => rewriteJsonResponse(v))
}
