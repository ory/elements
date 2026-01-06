<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { Settings } from "@ory/elements-vue"

useHead({ title: "Settings" })

definePageMeta({
  middleware: "auth",
})

const config = useOryConfig()
const flow = await useOrySettingsFlow()
const { data: sessionResult } = await useOrySession()
</script>

<template>
  <div class="flex flex-col gap-8 items-center mb-8">
    <Settings
      v-if="flow"
      :flow="flow"
      :config="config"
      :session="sessionResult?.session"
    />
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>
  </div>
</template>
