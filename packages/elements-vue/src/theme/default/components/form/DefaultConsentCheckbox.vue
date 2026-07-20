<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
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

const scopeDescription = computed(() => {
  if (
    props.node.meta?.label?.context &&
    typeof props.node.meta.label.context === "object" &&
    "scope_description" in props.node.meta.label.context
  ) {
    return String(
      (props.node.meta.label.context as Record<string, unknown>)
        .scope_description,
    )
  }
  return null
})

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  props.onChange?.(target.checked)
}
</script>

<template>
  <label
    :class="
      cn(
        'flex cursor-pointer items-start gap-3 rounded-lg p-4',
        'border border-input-border-default',
        'hover:border-input-border-hover hover:bg-input-background-hover',
        'transition-colors',
      )
    "
  >
    <input
      type="checkbox"
      :name="attributes.name"
      :checked="modelValue"
      :disabled="attributes.disabled"
      :class="
        cn(
          'mt-1 h-5 w-5 rounded border-input-border-default bg-input-background-default',
          'checked:border-button-primary-border-default checked:bg-button-primary-background-default',
          'focus:ring-2 focus:ring-button-primary-background-default focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )
      "
      :data-testid="`ory/form/node/checkbox/consent/${attributes.name}`"
      @change="handleChange"
    />
    <div class="flex flex-col gap-1">
      <span class="font-medium text-interface-foreground-default-primary">
        {{ attributes.label?.text ?? attributes.name }}
      </span>
      <span
        v-if="scopeDescription"
        class="text-sm text-interface-foreground-default-secondary"
      >
        {{ scopeDescription }}
      </span>
    </div>
  </label>
</template>
