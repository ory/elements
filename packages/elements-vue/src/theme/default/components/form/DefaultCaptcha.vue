<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { UiNode } from "@ory/client-fetch"

defineProps<{
  node: UiNode
}>()

const captchaRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // Captcha initialization would happen here
  // This is a placeholder - actual implementation depends on the captcha provider
})
</script>

<template>
  <div
    ref="captchaRef"
    class="flex items-center justify-center"
    data-testid="ory/form/node/captcha"
  />
</template>
