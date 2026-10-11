// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { computed, Comment, Text, type Slots } from "vue"

/**
 * Checks if the default slot has real content (not just comments or empty text nodes).
 */
export function useHasSlotContent(slots: Slots) {
  return computed(() => {
    const slotContent = slots.default?.()
    if (
      !slotContent ||
      !Array.isArray(slotContent) ||
      slotContent.length === 0
    ) {
      return false
    }
    return slotContent.some((vnode) => {
      if (vnode.type === Comment) return false
      if (vnode.type === Text && (!vnode.children || vnode.children === "")) {
        return false
      }
      return vnode.children != null
    })
  })
}
