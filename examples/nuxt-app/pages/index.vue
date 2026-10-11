<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { useSession } from "@ory/elements-vue/client"

useHead({ title: "Home" })

// Use client-side session from SessionProvider
const { session, isLoading } = useSession()
const { data: logoutFlow } = await useOryLogout()

const traits = computed(() => {
  return session.value?.identity?.traits as
    | {
        email?: string
        username?: string
        phone?: string
      }
    | undefined
})

const displayName = computed(() => {
  return traits.value?.email ?? traits.value?.username ?? traits.value?.phone
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="flex flex-col items-center gap-4">
      <img src="/ory-logo.svg" alt="Ory Logo" width="160" />
      <h1 class="font-bold text-xl">Ory Nuxt Example</h1>

      <div
        v-if="!session"
        class="flex items-center gap-2 bg-white rounded-sm border flex-col w-60 p-3"
      >
        <NuxtLink class="underline block w-full" to="/registration">
          Registration
        </NuxtLink>
        <NuxtLink class="underline block w-full" to="/login"> Login </NuxtLink>
        <NuxtLink class="underline block w-full" to="/recovery">
          Account Recovery
        </NuxtLink>
        <NuxtLink class="underline block w-full" to="/verification">
          Account Verification
        </NuxtLink>
      </div>

      <div
        v-else
        class="flex items-center gap-2 bg-white rounded-sm border flex-col w-60 p-3"
      >
        <h2 class="w-full">Hi, {{ displayName }}!</h2>
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
      </div>

      <div class="flex gap-2 text-sm">
        <a
          href="https://github.com/ory/elements/tree/master/examples/nuxt-app"
          class="underline"
          target="_blank"
          rel="noreferrer"
        >
          Nuxt Example
        </a>
        <a
          href="https://github.com/ory/elements/tree/master/examples/nextjs-app-router"
          class="underline"
          target="_blank"
          rel="noreferrer"
        >
          Next.js Example
        </a>
      </div>
    </div>
  </div>
</template>
