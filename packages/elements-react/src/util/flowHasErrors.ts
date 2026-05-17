// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

import type { UiContainer } from "@ory/client-fetch"

/**
 * Returns true if the flow UI contains any error-type messages, either at the
 * top level (`ui.messages`) or on individual nodes (`ui.nodes[*].messages`).
 *
 * Kratos returns a 400 status code both for actual validation errors and for
 * multi-step flow transitions (e.g. identifier_first, profile_first, one-time
 * code). This helper distinguishes the two cases so that consumers only receive
 * `onValidationError` events when real errors are present.
 */
export function flowHasErrors(ui: UiContainer): boolean {
  if (ui.messages?.some((m) => m.type === "error")) {
    return true
  }
  return ui.nodes.some((node) => node.messages.some((m) => m.type === "error"))
}
