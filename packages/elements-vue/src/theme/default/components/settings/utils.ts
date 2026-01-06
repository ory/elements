// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { UiNode } from "@ory/client-fetch"
import { isUiNodeInputAttributes } from "@ory/client-fetch"

/**
 * Extracts display context from a node's metadata.
 */
export function getNodeContext(node: UiNode): {
  addedAt: string | null
  displayName: string | null
  keyId: string | null
} {
  const context = node.meta.label?.context ?? {}
  const addedAt = "added_at" in context ? (context.added_at as string) : null
  const displayName =
    "display_name" in context ? (context.display_name as string) : null
  const keyId = isUiNodeInputAttributes(node.attributes)
    ? String(node.attributes.value)
    : null
  return { addedAt, displayName, keyId }
}

/**
 * Formats a date string for display.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
    new Date(dateStr),
  )
}
