<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { Error } from "@ory/elements-vue/theme"
import type { OryError } from "@ory/elements-vue/theme"

useHead({ title: "Error" })

const oryConfig = useOryConfig()
const route = useRoute()

const errorId = computed(() => route.query.id as string | undefined)
const errorMessage = computed(() => route.query.error as string | undefined)
const errorDescription = computed(
  () => route.query.error_description as string | undefined,
)

const { data: flowError } = await useOryFlowError(errorId.value)

// Build the OryError object from the flow error or query params
const oryError = computed<OryError | null>(() => {
  if (flowError.value) {
    return flowError.value
  }

  // Handle OAuth2 errors from query params
  if (errorMessage.value && errorDescription.value) {
    return {
      error: errorMessage.value,
      error_description: errorDescription.value,
    }
  }

  // Handle generic error from query params
  if (errorMessage.value) {
    return {
      error: {
        code: 500,
        message: errorMessage.value,
        status: "error",
      },
    }
  }

  return null
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Error v-if="oryError" :error="oryError" :config="oryConfig" />

    <!-- Fallback for when no error data is available -->
    <div v-else class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h1>
        <p class="text-gray-700 mb-6">
          An unexpected error occurred during the authentication process.
        </p>
        <div class="space-y-2">
          <NuxtLink
            to="/"
            class="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go to Home
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="block text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Try Login Again
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
