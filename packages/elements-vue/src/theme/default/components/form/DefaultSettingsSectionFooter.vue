<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div
    class="flex min-h-[72px] items-center justify-between gap-2 rounded-b-cards border border-interface-border-default-primary bg-interface-background-default-secondary px-6 py-4 text-interface-foreground-default-tertiary"
  >
    <span v-if="text">{{ text }}</span>
    <span v-else />
    <slot />
  </div>
</template>
