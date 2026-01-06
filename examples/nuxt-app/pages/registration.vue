<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { Registration } from "@ory/elements-vue"

useHead({ title: "Registration" })

definePageMeta({
  layout: "auth",
})

const config = useOryConfig()
const route = useRoute()
const nuxtApp = useNuxtApp()

const { data: flow, error } = await useAsyncData(
  `registration-flow-${route.query.flow || "init"}`,
  () => useOryRegistrationFlow(),
  {
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    watch: false,
  },
)
</script>

<template>
  <div>
    <Registration v-if="flow" :flow="flow" :config="config" />
    <div v-else class="text-center">
      <p class="text-gray-500">Loading...</p>
    </div>
  </div>
</template>
