<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const props = defineProps<{
  action?: string
  method?: string
  onSubmit?: (e: Event) => void
}>()

const formRef = ref<HTMLFormElement | null>(null)
let originalSubmit: (() => void) | null = null

/**
 * Override form.submit() to use our handler instead of native submission.
 * This is needed because WebAuthn scripts call form.submit() directly,
 * which bypasses the onSubmit event handler.
 */
onMounted(() => {
  if (formRef.value && props.onSubmit) {
    originalSubmit = formRef.value.submit.bind(formRef.value)

    formRef.value.submit = function () {
      const event = new Event("submit", {
        bubbles: true,
        cancelable: true,
      })

      Object.defineProperty(event, "target", {
        value: formRef.value,
        writable: false,
      })

      props.onSubmit!(event)
    }
  }
})

onUnmounted(() => {
  if (formRef.value && originalSubmit) {
    formRef.value.submit = originalSubmit
  }
})
</script>

<template>
  <form
    ref="formRef"
    :action="action"
    :method="method"
    novalidate
    class="grid gap-8"
    @submit="onSubmit"
  >
    <slot />
  </form>
</template>
