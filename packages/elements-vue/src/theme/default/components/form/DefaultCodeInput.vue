<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import { FlowType } from "@ory/client-fetch"
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import PinInput from "./PinInput.vue"

const props = defineProps<{
  node: UiNode
  attributes: UiNodeInputAttributes
  modelValue?: string | number
  onChange?: (value: string | number) => void
  onBlur?: () => void
}>()

const { flowType } = useOryFlow()

const hasError = computed(() => props.node.messages.length > 0)

const inputValue = computed(() =>
  String(props.modelValue ?? props.attributes.value ?? ""),
)

const containerClass = computed(() =>
  flowType.value === FlowType.Settings ? "max-w-[488px]" : "",
)

function handleUpdate(value: string) {
  props.onChange?.(value)
}
</script>

<template>
  <PinInput
    :name="attributes.name"
    :length="6"
    :model-value="inputValue"
    :disabled="attributes.disabled"
    :has-error="hasError"
    :class="containerClass"
    @update:model-value="handleUpdate"
  />
</template>
