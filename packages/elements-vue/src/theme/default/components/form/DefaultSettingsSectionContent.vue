<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div
    class="flex flex-col gap-8 rounded-t-cards border border-b-0 border-interface-border-default-primary bg-interface-background-default-primary px-6 py-8"
  >
    <div class="flex flex-col gap-2">
      <h3 class="font-medium text-interface-foreground-default-primary">
        {{ title }}
      </h3>
      <span
        v-if="description"
        class="text-interface-foreground-default-secondary"
      >
        {{ description }}
      </span>
    </div>
    <slot />
  </div>
</template>
