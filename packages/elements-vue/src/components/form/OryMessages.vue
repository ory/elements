<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { UiText } from "@ory/client-fetch"
import { useComponents } from "../../composables/useComponents"

withDefaults(
  defineProps<{
    messages?: UiText[]
  }>(),
  {
    messages: () => [],
  },
)

const components = useComponents()
</script>

<template>
  <component
    :is="components.Message.Root"
    v-if="messages && messages.length > 0"
  >
    <component
      :is="components.Message.Content"
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />
  </component>
</template>
