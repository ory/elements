<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import { useOryConfig } from "../../../../composables/useOryConfig"

const config = useOryConfig()

const logoUrl = computed(() => config.project?.logo_light_url)
const projectName = computed(() => config.project?.name)
</script>

<template>
  <img
    v-if="logoUrl"
    :src="logoUrl"
    :alt="projectName ?? 'Logo'"
    class="h-full max-h-9 self-start"
    data-testid="ory/card/logo"
  />
  <h1
    v-else-if="projectName"
    class="text-xl leading-normal font-semibold text-interface-foreground-default-primary"
    data-testid="ory/card/logo"
  >
    {{ projectName }}
  </h1>
</template>
