<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, useSlots } from "vue"
import { FlowType } from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { cn } from "../../utils/cn"

const { flowType } = useOryFlow()
const slots = useSlots()

const hasContent = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return false
  return defaultSlot.some(
    (vnode) =>
      vnode.type !== Comment &&
      (typeof vnode.type !== "symbol" || vnode.children?.length),
  )
})

const containerClass = computed(() =>
  cn(
    "grid",
    flowType.value === FlowType.OAuth2Consent
      ? "grid-cols-2 gap-2"
      : "grid-cols-1 gap-8",
  ),
)
</script>

<template>
  <div v-if="hasContent" :class="containerClass">
    <slot />
  </div>
</template>
