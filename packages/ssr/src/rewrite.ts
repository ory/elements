// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Removes `undefined` values from a JSON response (objects, arrays, strings)
 * and, if `rewrite` is given, replaces `rewrite.from` with `rewrite.to` in
 * every string.
 *
 * @param obj - The object to rewrite
 * @param rewrite - The Ory SDK URL to replace and the URL to replace it with
 * @returns The rewritten object.
 * @internal
 */
export function rewriteJsonResponse<T extends object>(
  obj: T,
  rewrite?: { from: string; to: string },
): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // Recursively process each item in the array
          return [
            key,
            value
              .map((item) => {
                if (item instanceof Date) {
                  return item
                } else if (typeof item === "object" && item !== null) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return rewriteJsonResponse(item, rewrite)
                } else if (typeof item === "string" && rewrite) {
                  return item.replaceAll(rewrite.from, rewrite.to)
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return item
              })
              .filter((item) => item !== undefined),
          ]
        } else if (value instanceof Date) {
          return [key, value]
        } else if (typeof value === "object" && value !== null) {
          // Recursively remove undefined in nested objects
          return [key, rewriteJsonResponse(value, rewrite)]
        } else if (typeof value === "string" && rewrite) {
          // Replace SDK URL with the provided proxy URL
          return [key, value.replaceAll(rewrite.from, rewrite.to)]
        }
        return [key, value]
      }),
  ) as T
}
