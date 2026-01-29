<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import {
  provideOryConfig,
  type OryClientConfiguration,
} from "../composables/useOryConfig"
import { provideOryFlow } from "../composables/useOryFlow"
import {
  provideComponents,
  type OryFlowComponents,
} from "../composables/useComponents"
import type { OryFlowContainer } from "../util/flowContainer"

const props = defineProps<{
  flowContainer: OryFlowContainer
  config: OryClientConfiguration
  components: OryFlowComponents
}>()

provideOryConfig(props.config)
provideOryFlow(props.flowContainer)
provideComponents({
  components: props.components,
})
</script>

<template>
  <div class="ory-elements font-sans-default">
    <slot />
  </div>
</template>
