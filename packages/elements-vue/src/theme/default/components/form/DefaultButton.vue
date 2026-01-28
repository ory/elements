<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { getNodeLabel } from "@ory/client-fetch"
import { cn } from "../../utils/cn"
import { uiTextToFormattedMessage } from "../../utils/i18n"
import { useOryIntl } from "../../../../composables/useOryIntl"
import Spinner from "./Spinner.vue"

const props = withDefaults(
  defineProps<{
    node: UiNode
    attributes: UiNodeInputAttributes
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

const intl = useOryIntl()
const t = (key: string, values?: Record<string, unknown>) =>
  String(intl.t(key, values))

const buttonBaseStyles = cn(
  "relative flex cursor-pointer justify-center gap-3 overflow-hidden rounded-buttons leading-none font-medium ring-1 ring-inset",
  "disabled:cursor-not-allowed",
  "transition-colors duration-100 ease-linear",
  "max-w-[488px] p-4",
)

const primaryStyles = cn(
  "bg-button-primary-background-default text-button-primary-foreground-default ring-button-primary-border-default",
  "hover:bg-button-primary-background-hover hover:text-button-primary-foreground-hover hover:ring-button-primary-border-hover",
  "disabled:bg-button-primary-background-disabled disabled:text-button-primary-foreground-disabled disabled:ring-button-primary-border-disabled",
)

const secondaryStyles = cn(
  "bg-button-secondary-background-default text-button-secondary-foreground-default ring-button-secondary-border-default",
  "hover:bg-button-secondary-background-hover hover:text-button-secondary-foreground-hover hover:ring-button-secondary-border-hover",
  "disabled:bg-button-secondary-background-disabled disabled:text-button-secondary-foreground-disabled disabled:ring-button-secondary-border-disabled",
)

const isPrimary = computed(() => {
  const name = props.attributes.name
  const value = props.attributes.value as string | undefined
  return (
    name === "method" ||
    name.includes("passkey") ||
    name.includes("webauthn") ||
    name.includes("lookup_secret") ||
    (name.includes("action") && value === "accept")
  )
})

const label = computed(() => {
  const nodeLabel = getNodeLabel(props.node)
  if (!nodeLabel) return "Submit"
  return uiTextToFormattedMessage(nodeLabel, t)
})

const loadingStyles = computed(() => (props.isSubmitting ? "cursor-wait" : ""))

const loadingOverlayBg = computed(() =>
  isPrimary.value
    ? "bg-button-primary-background-default"
    : "bg-button-secondary-background-default",
)

const buttonClass = computed(() =>
  cn(
    buttonBaseStyles,
    isPrimary.value ? primaryStyles : secondaryStyles,
    loadingStyles.value,
  ),
)

const buttonType = computed((): "submit" | "button" | "reset" => {
  const type = props.attributes.type as string
  if (type === "submit" || type === "button" || type === "reset") {
    return type
  }
  return "submit"
})

function handleClick(e: Event) {
  props.onClick?.(e)
}
</script>

<template>
  <button
    :type="buttonType"
    :name="attributes.name"
    :value="attributes.value"
    :disabled="isDisabled"
    :class="buttonClass"
    :data-testid="`ory/form/node/button/${attributes.name}`"
    :data-loading="isSubmitting"
    @click="handleClick"
  >
    <span
      v-if="isSubmitting"
      :class="
        cn('pointer-events-none absolute inset-0 opacity-80', loadingOverlayBg)
      "
    />
    <Spinner v-if="isSubmitting" />
    <span>{{ label }}</span>
  </button>
</template>
