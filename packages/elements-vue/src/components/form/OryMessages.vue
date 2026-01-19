<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script lang="ts">
const DEFAULT_HIDDEN_MESSAGE_IDS = [
  1040009, 1060003, 1080003, 1010004, 1010014, 1040005, 1010016, 1010003,
  1060004, 1060005, 1060006,
]
</script>

<script setup lang="ts">
import { computed } from "vue"
import type { UiText } from "@ory/client-fetch"
import { useComponents } from "../../composables/useComponents"

const props = withDefaults(
  defineProps<{
    messages?: UiText[]
    hiddenMessageIds?: number[]
  }>(),
  {
    messages: () => [],
    hiddenMessageIds: () => DEFAULT_HIDDEN_MESSAGE_IDS,
  },
)

const components = useComponents()

const filteredMessages = computed(() =>
  props.messages?.filter((m) => !props.hiddenMessageIds.includes(m.id)) ?? [],
)
</script>

<template>
  <component
    :is="components.Message.Root"
    v-if="filteredMessages.length > 0"
  >
    <component
      :is="components.Message.Content"
      v-for="message in filteredMessages"
      :key="message.id"
      :message="message"
    />
  </component>
</template>
