<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { Login } from "@ory/elements-vue"

useHead({ title: "Login" })

definePageMeta({
  layout: "auth",
})

const config = useOryConfig()
const route = useRoute()
const nuxtApp = useNuxtApp()

// Use useAsyncData to cache the flow from SSR and prevent client-side re-fetching
const { data: flow, error } = await useAsyncData(
  `login-flow-${route.query.flow || "init"}`,
  () => useOryLoginFlow(),
  {
    // Return cached data during HMR to avoid client-side API calls
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    // Prevent watching route changes (we use flow ID in key instead)
    watch: false,
  },
)
</script>

<template>
  <div>
    <div v-if="error" class="text-center text-red-500">
      <h2>Error Loading Login</h2>
      <p>{{ error.message }}</p>
    </div>
    <Login v-else-if="flow" :flow="flow" :config="config" />
    <div v-else class="text-center">
      <p class="text-gray-500">Loading...</p>
    </div>
  </div>
</template>
