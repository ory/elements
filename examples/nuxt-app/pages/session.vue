<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
useHead({ title: "Session" })

definePageMeta({
  middleware: "auth",
})

const { data: sessionResult } = await useOrySession()
const { data: logoutFlow } = await useOryLogout()

const session = computed(() => sessionResult.value?.session)
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="flex flex-col items-center gap-4">
      <img src="/ory-logo.svg" alt="Ory Logo" width="160" />
      <h1 class="font-bold text-xl">Session Info</h1>

      <div
        v-if="session"
        class="flex flex-col gap-2 bg-white rounded-sm border w-80 p-4"
      >
        <div class="border-b pb-2 mb-2">
          <h2 class="font-semibold text-sm text-gray-700">Identity</h2>
          <p v-if="session.identity?.traits?.email" class="text-sm">
            {{ session.identity.traits.email }}
          </p>
        </div>

        <div class="text-xs text-gray-600 space-y-1">
          <p>
            <span class="font-medium">Session ID:</span>
            <span class="font-mono">{{ session.id?.substring(0, 8) }}...</span>
          </p>
          <p v-if="session.authenticator_assurance_level">
            <span class="font-medium">AAL:</span>
            {{ session.authenticator_assurance_level }}
          </p>
          <p v-if="session.authenticated_at">
            <span class="font-medium">Authenticated:</span>
            {{ new Date(session.authenticated_at).toLocaleString() }}
          </p>
          <p v-if="session.expires_at">
            <span class="font-medium">Expires:</span>
            {{ new Date(session.expires_at).toLocaleString() }}
          </p>
        </div>

        <details class="mt-2 cursor-pointer">
          <summary
            class="text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            View raw data
          </summary>
          <pre
            class="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40"
            >{{ JSON.stringify(session, null, 2) }}</pre
          >
        </details>
      </div>

      <div v-else class="text-center">
        <p class="text-gray-500">Loading session...</p>
      </div>

      <div class="flex flex-col gap-2 bg-white rounded-sm border w-80 p-3">
        <NuxtLink class="underline block w-full" to="/settings">
          Settings
        </NuxtLink>
        <a
          v-if="logoutFlow?.logout_url"
          class="underline block w-full"
          :href="logoutFlow.logout_url"
        >
          Logout
        </a>
        <NuxtLink class="underline block w-full" to="/">
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
