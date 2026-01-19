<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { UserInitials } from "../../utils/user"
import Icon from "./Icon.vue"

withDefaults(
  defineProps<{
    initials: UserInitials
    disabled?: boolean
    title?: string
  }>(),
  {
    disabled: false,
    title: "",
  },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <button
    type="button"
    :class="[
      'relative flex size-10 items-center justify-center overflow-hidden rounded-[999px]',
      'bg-button-primary-background-default',
      !disabled && 'cursor-pointer hover:bg-button-primary-background-hover',
      disabled && 'cursor-default',
    ]"
    :disabled="disabled"
    :title="title"
    @click="emit('click', $event)"
  >
    <div class="relative flex size-full items-center justify-center">
      <img
        v-if="initials.avatar"
        :src="initials.avatar"
        :alt="initials.primary"
        class="w-full object-contain"
      />
      <Icon
        v-else
        name="user"
        :size="24"
        class="text-button-primary-foreground-default"
      />
    </div>
  </button>
</template>
