<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { cn } from "../../utils/cn"

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

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const activeIndex = ref(0)

const value = computed(() => props.modelValue || "")
const chars = computed(() => value.value.split(""))

function getSlotState(index: number) {
  const char = chars.value[index] || ""
  const isActive = isFocused.value && index === activeIndex.value
  const hasFakeCaret = isActive && !char
  return { char, isActive, hasFakeCaret }
}

function updateActiveIndex() {
  const len = value.value.length
  activeIndex.value = Math.min(len, props.length - 1)
}

watch(value, updateActiveIndex, { immediate: true })

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const newValue = target.value.replace(/\D/g, "").slice(0, props.length)
  emit("update:modelValue", newValue)
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Backspace" && !value.value) {
    e.preventDefault()
  }
}

function handleFocus() {
  isFocused.value = true
  updateActiveIndex()
}

function handleBlur() {
  isFocused.value = false
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const pastedData = e.clipboardData?.getData("text") || ""
  const digits = pastedData.replace(/\D/g, "").slice(0, props.length)
  emit("update:modelValue", digits)
}

function focusInput() {
  inputRef.value?.focus()
}

onMounted(() => {
  updateActiveIndex()
})
</script>

<template>
  <input type="hidden" :name="name" :value="value" />
  <div
    :class="
      cn('flex w-full items-center gap-2 has-disabled:opacity-50', props.class)
    "
  >
    <div
      class="w-full"
      :class="cn(disabled && 'cursor-not-allowed')"
      :style="{
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'text',
        userSelect: 'none',
        pointerEvents: 'none',
      }"
    >
      <div class="flex w-full items-center justify-stretch gap-2">
        <div
          v-for="(_, index) in length"
          :key="index"
          :class="
            cn(
              'w-full rounded-forms border border-solid bg-input-background-default py-[15px] text-center text-input-foreground-primary focus-visible:outline-hidden',
              'relative flex items-center justify-center leading-none transition-all',
              getSlotState(index).isActive
                ? 'border-input-border-focus'
                : 'border-input-border-default',
              hasError && 'border-interface-border-validation-danger',
              disabled &&
                'border-input-border-disabled bg-input-background-disabled text-input-foreground-disabled',
            )
          "
          :style="{ pointerEvents: 'all' }"
          @click="focusInput"
        >
          <span class="inline-block size-4">{{
            getSlotState(index).char
          }}</span>
          <div
            v-if="getSlotState(index).hasFakeCaret"
            class="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              class="h-4 w-px animate-caret-blink bg-interface-background-brand-primary duration-700"
            />
          </div>
        </div>
      </div>
      <input
        ref="inputRef"
        :class="cn(disabled && 'cursor-not-allowed')"
        :data-testid="`ory/form/node/input/${name}`"
        data-input-otp="true"
        inputmode="numeric"
        :aria-placeholder="disabled ? undefined : 'Enter your Login code'"
        :placeholder="disabled ? undefined : 'Enter your Login code'"
        :maxlength="length"
        :value="value"
        :data-input-otp-mss="0"
        :style="{
          position: 'absolute',
          inset: '0px',
          width: 'calc(100% + 40px)',
          height: '100%',
          display: 'flex',
          textAlign: 'left',
          opacity: 1,
          color: 'transparent',
          pointerEvents: 'all',
          background: 'transparent',
          caretColor: 'transparent',
          border: '0px solid transparent',
          outline: 'transparent solid 0px',
          boxShadow: 'none',
          lineHeight: 1,
          letterSpacing: '-0.5em',
          fontSize: '48px',
          fontFamily: 'monospace',
          fontVariantNumeric: 'tabular-nums',
          clipPath: 'inset(0px 40px 0px 0px)',
        }"
        :autocomplete="autocomplete"
        :disabled="disabled"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @blur="handleBlur"
        @paste="handlePaste"
      />
    </div>
  </div>
</template>
