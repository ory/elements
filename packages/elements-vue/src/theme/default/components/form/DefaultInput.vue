<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, computed } from "vue"
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { getNodeLabel, FlowType } from "@ory/client-fetch"
import { cn } from "../../utils/cn"
import { resolvePlaceholder } from "../../utils/i18n"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useOryFlow } from "../../../../composables/useOryFlow"
import Icon from "../ui/Icon.vue"

const props = defineProps<{
  node: UiNode
  attributes: UiNodeInputAttributes
  modelValue?: string | number
  onChange?: (value: string | number) => void
  onBlur?: () => void
}>()

const showPassword = ref(false)
const intl = useOryIntl()
const { flowType } = useOryFlow()
const t = (key: string, values?: Record<string, unknown>) =>
  String(intl.t(key, values))

const defaultInputClassName = cn(
  "w-full rounded-forms border leading-tight antialiased transition-colors focus:ring-0 focus-visible:outline-none",
  "border-input-border-default bg-input-background-default text-input-foreground-primary",
  "focus-within:border-input-border-focus focus-visible:border-input-border-focus",
  "hover:bg-input-background-hover",
)

const passwordWrapperClassName = cn(
  defaultInputClassName,
  "flex justify-stretch not-focus-within:hover:border-input-border-hover",
  "data-[disabled=true]:border-input-border-disabled data-[disabled=true]:bg-input-background-disabled data-[disabled=true]:text-input-foreground-disabled",
)

const passwordInputClassName = cn(
  "w-full rounded-l-forms rounded-r-none bg-transparent px-4 py-[13px] text-input-foreground-primary",
  "placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus:outline-none",
  "disabled:bg-input-background-disabled disabled:text-input-foreground-disabled",
)

const textInputClassName = cn(
  "px-4 py-[13px] hover:border-input-border-hover",
  "placeholder:h-[20px] placeholder:text-input-foreground-tertiary",
  "disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled",
)

const placeholder = computed(() => {
  const label = getNodeLabel(props.node)
  return label ? resolvePlaceholder(label, t) : ""
})

const isSettingsFlow = computed(() => flowType.value === FlowType.Settings)

const inputType = computed(() =>
  props.attributes.type === "password" && showPassword.value
    ? "text"
    : props.attributes.type,
)

const inputValue = computed(
  () =>
    props.modelValue ??
    (props.attributes.value as string | number | undefined) ??
    "",
)

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  props.onChange?.(target.value)
}

function handleBlur() {
  props.onBlur?.()
}

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div
    v-if="attributes.type === 'password'"
    :class="cn(passwordWrapperClassName, isSettingsFlow && 'max-w-[488px]')"
    :data-disabled="attributes.disabled"
  >
    <input
      :type="inputType"
      :name="attributes.name"
      :value="inputValue"
      :placeholder="placeholder"
      :required="attributes.required"
      :disabled="attributes.disabled"
      :autocomplete="attributes.autocomplete"
      :pattern="attributes.pattern"
      :class="passwordInputClassName"
      :data-testid="`ory/form/node/input/${attributes.name}`"
      @input="handleInput"
      @blur="handleBlur"
    />
    <button
      type="button"
      class="cursor-pointer bg-transparent px-2 py-[13px]"
      @click="togglePassword"
    >
      <Icon :name="showPassword ? 'eye-off' : 'eye'" :size="20" />
    </button>
  </div>
  <input
    v-else
    :type="attributes.type"
    :name="attributes.name"
    :value="inputValue"
    :placeholder="placeholder"
    :required="attributes.required"
    :disabled="attributes.disabled"
    :autocomplete="attributes.autocomplete"
    :pattern="attributes.pattern"
    :class="cn(defaultInputClassName, textInputClassName, isSettingsFlow && 'max-w-[488px]')"
    :data-testid="`ory/form/node/input/${attributes.name}`"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>
