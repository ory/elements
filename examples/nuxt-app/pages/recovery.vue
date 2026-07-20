<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { Recovery } from "@ory/elements-vue"

useHead({ title: "Recovery" })

definePageMeta({
  layout: "auth",
})

const config = useOryConfig()
const flow = await useOryRecoveryFlow()
</script>

<template>
  <div>
    <Recovery v-if="flow" :flow="flow" :config="config" />
    <div v-else class="text-center">
      <p class="text-gray-500">Loading...</p>
    </div>
  </div>
</template>
