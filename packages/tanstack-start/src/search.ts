// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * The query parameters of the page that renders an Ory flow, such as `flow`
 * and `return_to`.
 *
 * @public
 */
export type OrySearchParams = Record<string, string | string[]>

function toParamValue(value: unknown): string | undefined {
  switch (typeof value) {
    case "string":
      return value
    case "number":
    case "boolean":
    case "bigint":
      return String(value)
    default:
      return undefined
  }
}

/**
 * Validates the input of a server function that fetches an Ory flow. Pass it
 * to `createServerFn().validator()` and call the server function with the
 * route's search params.
 *
 * TanStack Router parses search params as JSON, so `?flow=123` arrives as a
 * number. This turns every value back into its query string form and drops
 * values that have none.
 *
 * @example
 * ```ts
 * export const loginFlowFn = createServerFn({ method: "GET" })
 *   .validator(validateOrySearch)
 *   .handler(({ data }) => getLoginFlow(config, data))
 * ```
 *
 * @param input - The route's search params, as an object or a query string.
 * @returns The search params as strings.
 * @public
 */
export function validateOrySearch(input: unknown): OrySearchParams {
  if (typeof input === "string") {
    const result = new Map<string, string | string[]>()
    new URLSearchParams(input).forEach((value, key) => {
      const existing = result.get(key)
      if (existing === undefined) {
        result.set(key, value)
      } else {
        result.set(key, [
          ...(Array.isArray(existing) ? existing : [existing]),
          value,
        ])
      }
    })
    return Object.fromEntries(result)
  }

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {}
  }

  const result = new Map<string, string | string[]>()
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      const values = value
        .map(toParamValue)
        .filter((v): v is string => v !== undefined)
      if (values.length > 0) {
        result.set(key, values)
      }
      continue
    }
    const v = toParamValue(value)
    if (v !== undefined) {
      result.set(key, v)
    }
  }
  return Object.fromEntries(result)
}

export function toURLSearchParams(search: OrySearchParams): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      params.append(key, v)
    }
  }
  return params
}
