<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiNode } from "@ory/client-fetch"
import { cn } from "../../utils/cn"

const props = defineProps<{
  nodes: UiNode[]
}>()

const gridClass = computed(() => {
  const len = props.nodes.length
  return cn("grid gap-3", {
    "grid-cols-1": len % 4 <= 2,
    "grid-cols-3": len % 3 === 0,
    "grid-cols-4": len > 1 && len % 4 === 0,
  })
})
</script>

<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>
