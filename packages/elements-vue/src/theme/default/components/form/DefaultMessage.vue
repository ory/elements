<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiText } from "@ory/client-fetch"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { uiTextToFormattedMessage } from "../../utils/i18n"

const props = defineProps<{
  message: UiText
}>()

const intl = useOryIntl()
const t = (key: string, values?: Record<string, unknown>) =>
  String(intl.t(key, values))

const messageTypeClasses: Record<string, string> = {
  error: "text-interface-foreground-validation-danger",
  info: "text-interface-foreground-default-secondary",
  success: "text-interface-foreground-validation-success",
}

const messageClass = computed(
  () => `leading-normal ${messageTypeClasses[props.message.type] ?? ""}`,
)

const formattedMessage = computed(() =>
  uiTextToFormattedMessage(props.message, t),
)
</script>

<template>
  <span :class="messageClass" :data-testid="`ory/message/${message.id}`">
    {{ formattedMessage }}
  </span>
</template>
