<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { Session } from "@ory/client-fetch"
import { provideSession } from "./useSession"

const props = defineProps<{
  /**
   * Initial session from server-side rendering
   */
  session?: Session | null
  /**
   * Base URL for the Ory SDK (defaults to window.location.origin)
   */
  baseUrl?: string
}>()

provideSession({
  session: props.session,
  baseUrl: props.baseUrl,
})
</script>

<template>
  <slot />
</template>
