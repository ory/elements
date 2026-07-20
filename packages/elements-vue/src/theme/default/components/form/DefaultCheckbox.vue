<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { cn } from "../../utils/cn"

const props = withDefaults(
  defineProps<{
    node: UiNode
    attributes: UiNodeInputAttributes
    modelValue?: boolean
    onChange?: (checked: boolean) => void
  }>(),
  {
    modelValue: false,
  },
)

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  props.onChange?.(target.checked)
}
</script>

<template>
  <label class="flex cursor-pointer items-center gap-3">
    <input
      type="checkbox"
      :name="attributes.name"
      :checked="modelValue"
      :disabled="attributes.disabled"
      :class="
        cn(
          'h-5 w-5 rounded border-input-border-default bg-input-background-default',
          'checked:border-button-primary-border-default checked:bg-button-primary-background-default',
          'focus:ring-2 focus:ring-button-primary-background-default focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )
      "
      :data-testid="`ory/form/node/checkbox/${attributes.name}`"
      @change="handleChange"
    />
    <span
      v-if="attributes.label?.text"
      class="text-interface-foreground-default-primary"
    >
      {{ attributes.label.text }}
    </span>
  </label>
</template>
