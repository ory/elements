// SPDX-License-Identifier: Apache-2.0

import type { QueryParams } from "@ory/tanstack-start"

export function validateOrySearch(
  search: Record<string, unknown>,
): QueryParams {
  const params: QueryParams = {}
  for (const [key, value] of Object.entries(search)) {
    if (typeof value === "string") {
      params[key] = value
    } else if (
      Array.isArray(value) &&
      value.every((item): item is string => typeof item === "string")
    ) {
      params[key] = value
    }
  }
  return params
}
