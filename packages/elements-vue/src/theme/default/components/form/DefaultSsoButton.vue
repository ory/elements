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
    provider: string
    isSubmitting?: boolean
    isFormSubmitting?: boolean
    onClick?: (e: Event) => void
  }>(),
  {
    isSubmitting: false,
    isFormSubmitting: false,
  },
)

// Button is disabled when: node disabled, this button is submitting, or any form submission is in progress
const isDisabled = computed(
  () =>
    props.attributes.disabled || props.isSubmitting || props.isFormSubmitting,
)

const providerName = computed(
  () => props.provider.charAt(0).toUpperCase() + props.provider.slice(1),
)

function handleClick(e: Event) {
  props.onClick?.(e)
}
</script>

<template>
  <button
    type="submit"
    :name="attributes.name"
    :value="attributes.value"
    :disabled="isDisabled"
    :class="
      cn(
        'flex w-full items-center justify-center gap-3 rounded-buttons p-4',
        'bg-button-social-background-default text-button-social-foreground-default ring-1 ring-button-social-border-default ring-inset',
        'hover:bg-button-social-background-hover hover:text-button-social-foreground-hover hover:ring-button-social-border-hover',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors duration-100 ease-linear',
      )
    "
    :data-testid="`ory/form/node/button/social/${provider}`"
    @click="handleClick"
  >
    <span>Continue with {{ providerName }}</span>
  </button>
</template>
