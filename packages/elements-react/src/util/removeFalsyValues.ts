// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

type AnyObject = Record<string, unknown>

/**
 * Removes any properties from an object or elements from an array that are empty strings or undefined.
 *
 * @param input any object or array
 * @returns the object with any property removed that is an empty string or undefined
 */
export function removeEmptyStrings<T>(input: T): T {
  // Arrays: clean elements and drop falsy ones
  if (Array.isArray(input)) {
    return (
      input
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map((item) => removeEmptyStrings(item))
        .filter(
          (v) => v || typeof v === "boolean" || typeof v === "number",
        ) as unknown as T
    )
  }

  // Non-objects: return as-is
  if (input === null || typeof input !== "object") {
    return input
  }

  const obj = input as AnyObject
  const out: AnyObject = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      const cleaned = removeEmptyStrings(value)
      // keep only if the nested object/array still has content
      if (Array.isArray(cleaned)) {
        if (cleaned.length) {
          out[key] = cleaned
        }
      } else if (cleaned && Object.keys(cleaned as AnyObject).length > 0) {
        out[key] = cleaned
      }
    } else if (
      value ||
      typeof value === "boolean" ||
      typeof value === "number"
    ) {
      out[key] = value
    }
  }

  return out as T
}
