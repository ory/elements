<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    length?: number
    modelValue?: string
    name: string
    disabled?: boolean
    hasError?: boolean
    class?: string
    autocomplete?: string
  }>(),
  {
    length: 6,
    modelValue: "",
    disabled: false,
    hasError: false,
    class: "",
    autocomplete: "one-time-code",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const inputs = ref<HTMLInputElement[]>([])
const values = ref<string[]>(Array.from({ length: props.length }, () => ""))

watch(
  () => props.modelValue,
  (newValue) => {
    const chars = (newValue || "").split("")
    values.value = Array.from(
      { length: props.length },
      (_, i) => chars[i] || "",
    )
  },
  { immediate: true },
)

function emitValue() {
  emit("update:modelValue", values.value.join(""))
}

function focusInput(index: number) {
  if (index >= 0 && index < props.length && inputs.value[index]) {
    inputs.value[index].focus()
  }
}

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (value.length > 1) {
    values.value[index] = value.slice(-1)
    target.value = values.value[index]
  } else {
    values.value[index] = value
  }

  emitValue()

  if (value && index < props.length - 1) {
    focusInput(index + 1)
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  const target = event.target as HTMLInputElement

  if (event.key === "Backspace") {
    if (!target.value && index > 0) {
      focusInput(index - 1)
      values.value[index - 1] = ""
      emitValue()
    }
  } else if (event.key === "ArrowLeft" && index > 0) {
    focusInput(index - 1)
  } else if (event.key === "ArrowRight" && index < props.length - 1) {
    focusInput(index + 1)
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData("text") || ""
  const digits = pastedData.replace(/\D/g, "").slice(0, props.length)

  digits.split("").forEach((digit, i) => {
    values.value[i] = digit
  })

  emitValue()

  const nextEmpty = values.value.findIndex((v) => !v)
  focusInput(nextEmpty >= 0 ? nextEmpty : props.length - 1)
}

function setInputRef(el: HTMLInputElement | null, index: number) {
  if (el) {
    inputs.value[index] = el
  }
}
</script>

<template>
  <div :class="['flex w-full justify-stretch gap-2', props.class]">
    <input type="hidden" :name="name" :value="values.join('')" />
    <input
      v-for="(_, index) in length"
      :key="index"
      :ref="(el) => setInputRef(el as HTMLInputElement | null, index)"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :autocomplete="autocomplete"
      :value="values[index]"
      :disabled="disabled"
      :class="[
        'w-full rounded-forms border border-solid py-[15px] text-center leading-none transition-all',
        'focus:outline-none focus-visible:outline-none',
        hasError
          ? 'border-interface-border-validation-danger'
          : 'border-input-border-default focus:border-input-border-focus',
        'bg-input-background-default text-input-foreground-primary',
        'disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled',
      ]"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      @paste="handlePaste"
    />
  </div>
</template>
