<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div v-if="text" class="flex items-center gap-4">
    <div class="h-px flex-1 bg-form-border-default" />
    <span class="text-sm text-interface-foreground-default-tertiary">{{
      text
    }}</span>
    <div class="h-px flex-1 bg-form-border-default" />
  </div>
  <div v-else class="h-px w-full bg-form-border-default" />
</template>
