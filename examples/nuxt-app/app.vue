<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { SessionProvider } from "@ory/elements-vue/client"

// Get session from server for hydration
const { data: sessionResult } = await useOrySession()
const initialSession = computed(() => sessionResult.value?.session ?? null)
</script>

<template>
  <SessionProvider :session="initialSession">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </SessionProvider>
</template>
