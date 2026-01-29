<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const props = defineProps<{
  action: string
  method: string
  onSubmit?: (event: Event) => void
}>()

const formRef = ref<HTMLFormElement | null>(null)
let originalSubmit: (() => void) | null = null

function handleSubmit(event: Event) {
  if (props.onSubmit) {
    event.preventDefault()
    props.onSubmit(event)
  }
}

onMounted(() => {
  if (formRef.value && props.onSubmit) {
    originalSubmit = formRef.value.submit.bind(formRef.value)
    formRef.value.submit = () => {
      const event = new SubmitEvent("submit", {
        bubbles: true,
        cancelable: true,
      })
      formRef.value?.dispatchEvent(event)
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
    class="flex w-full max-w-[var(--breakpoint-sm)] flex-col px-4 md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px]"
    @submit="handleSubmit"
  >
    <slot />
  </form>
</template>
