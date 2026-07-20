<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiText } from "@ory/client-fetch"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { cn } from "../../utils/cn"
import Icon from "./Icon.vue"

const props = defineProps<{
  message: UiText
  id?: string | number
  onDismiss?: () => void
}>()

const intl = useOryIntl()

const title = computed(() =>
  props.message.type === "error"
    ? intl.t("settings.messages.toast-title.error")
    : intl.t("settings.messages.toast-title.success"),
)

const messageText = computed(() => {
  const key = `identities.messages.${props.message.id}`
  const translation = intl.t(
    key,
    props.message.context as Record<string, unknown>,
  )
  return translation !== key ? translation : props.message.text
})

const titleClass = computed(() =>
  cn("font-medium", {
    "text-interface-foreground-validation-success":
      props.message.type === "success",
    "text-interface-foreground-validation-danger":
      props.message.type === "error",
    "text-interface-foreground-validation-warning":
      (props.message.type as string) === "warning",
  }),
)

function handleDismiss() {
  props.onDismiss?.()
}
</script>

<template>
  <div
    class="flex-col rounded-cards border border-interface-border-default-primary bg-interface-background-default-inverted px-4 py-2"
    :data-testid="`ory/message/${message.id}`"
  >
    <div class="flex items-center justify-between">
      <p :class="titleClass">
        {{ title }}
      </p>
      <button
        v-if="onDismiss"
        :data-testid="`ory/message/${message.id}.close`"
        class="cursor-pointer text-interface-foreground-default-inverted"
        @click="handleDismiss"
      >
        <Icon name="x" :size="16" />
      </button>
    </div>
    <p class="text-interface-foreground-default-inverted">
      {{ messageText }}
    </p>
  </div>
</template>
