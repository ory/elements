<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiText } from "@ory/client-fetch"

const props = defineProps<{
  message: UiText
}>()

const messageTypeClasses: Record<string, string> = {
  error: "text-interface-foreground-validation-danger",
  info: "text-interface-foreground-default-secondary",
  success: "text-interface-foreground-validation-success",
}

const messageClass = computed(
  () => `leading-normal ${messageTypeClasses[props.message.type] ?? ""}`,
)
</script>

<template>
  <span :class="messageClass" :data-testid="`ory/message/${message.id}`">
    {{ message.text }}
  </span>
</template>
