// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { FormValues } from "../types"

/**
 * A transient payload value or factory function.
 *
 * When a static object, it is included as-is in the submission body.
 * When a function, it receives the current form values at submission time
 * and must return the transient payload object.
 *
 * @group Utilities
 */
export type OryTransientPayload =
  | Record<string, unknown>
  | ((formValues: FormValues) => Record<string, unknown>)

/**
 * Resolves an `OryTransientPayload` value and merges it with any existing
 * transient payload fields from UI nodes (e.g., captcha responses).
 *
 * User-provided values take priority over node-derived values via shallow
 * `Object.assign`.
 *
 * @param transientPayload - The user-provided transient payload prop.
 * @param formValues - The current form values at submission time.
 * @param existingNodeValues - Transient payload values derived from UI nodes.
 * @returns The merged transient payload object.
 *
 * @group Utilities
 */
export function resolveTransientPayload(
  transientPayload: OryTransientPayload | undefined,
  formValues: FormValues,
  existingNodeValues?: Record<string, unknown>,
): Record<string, unknown> {
  const raw =
    typeof transientPayload === "function"
      ? transientPayload(formValues)
      : transientPayload
  const resolved =
    typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw : {}

  if (!existingNodeValues) {
    return resolved
  }

  return { ...existingNodeValues, ...resolved }
}
