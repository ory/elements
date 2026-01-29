<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import Icon from "../ui/Icon.vue"
import Spinner from "../form/Spinner.vue"

defineProps<{
  title: string
  disabled?: boolean
}>()

defineEmits<{
  click: [e: Event]
}>()
</script>

<template>
  <button
    type="button"
    class="relative cursor-pointer"
    :title="title"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Spinner v-if="disabled" class="relative" />
    <Icon
      v-else
      name="trash"
      class="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
      :size="24"
    />
  </button>
</template>
