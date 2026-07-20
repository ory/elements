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

const labelText = computed(
  () => props.attributes.label?.text ?? props.node.meta.label?.text,
)

const hasError = computed(() =>
  props.node.messages.some((m) => m.type === "error"),
)

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  props.onChange?.(target.checked)
}
</script>

<template>
  <label class="flex cursor-pointer items-start gap-3 self-stretch antialiased">
    <span class="flex h-5 items-center">
      <input
        type="checkbox"
        :name="attributes.name"
        :checked="modelValue"
        :disabled="attributes.disabled"
        :class="
          cn(
            'peer size-4 appearance-none rounded-forms border border-checkbox-border-checkbox-border-default bg-checkbox-background-default checked:border-checkbox-border-checkbox-border-checked checked:bg-checkbox-background-checked',
            hasError && 'border-interface-border-validation-danger',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )
        "
        :data-testid="`ory/form/node/input/${attributes.name}`"
        @change="handleChange"
      />
      <svg
        class="absolute hidden size-4 fill-checkbox-foreground-checked peer-checked:block"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6464 5.14645C11.8417 4.95118 12.1583 4.95118 12.3536 5.14645C12.5338 5.32669 12.5477 5.6103 12.3951 5.80645L12.3536 5.85355L7.35355 10.8536C7.17331 11.0338 6.8897 11.0477 6.69355 10.8951L6.64645 10.8536L4.14645 8.35355C3.95118 8.15829 3.95118 7.84171 4.14645 7.64645C4.32669 7.4662 4.6103 7.45234 4.80645 7.60485L4.85355 7.64645L7 9.7925L11.6464 5.14645Z"
        />
      </svg>
    </span>
    <span class="flex flex-col">
      <span
        v-if="labelText"
        class="leading-tight font-normal text-interface-foreground-default-primary"
      >
        {{ labelText }}
      </span>
      <span
        v-for="message in node.messages"
        :key="message.id"
        :class="
          cn(
            'mt-1',
            message.type === 'error'
              ? 'text-interface-foreground-validation-danger'
              : 'text-interface-foreground-default-secondary',
          )
        "
      >
        {{ message.text }}
      </span>
    </span>
  </label>
</template>
