<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { cn } from "../../utils/cn"
import DefaultBadge from "./DefaultBadge.vue"

defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="cn('ory-elements', $props.class)">
    <div
      class="flex w-full flex-1 items-start justify-center font-sans-default sm:w-[480px] sm:max-w-[480px] sm:items-center"
    >
      <div
        class="relative grid w-full grid-cols-1 gap-8 border-b border-form-border-default bg-form-background-default px-8 py-12 sm:rounded-cards sm:border sm:px-12 sm:py-14"
        data-testid="ory/card"
      >
        <slot />
        <DefaultBadge />
      </div>
    </div>
  </div>
</template>
