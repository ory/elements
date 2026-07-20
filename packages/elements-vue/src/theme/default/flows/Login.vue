<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { LoginFlow } from "@ory/client-fetch"
import { FlowType } from "@ory/client-fetch"
import { OryProvider, OrySelfServiceFlowCard } from "../../../components"
import { getOryComponents } from "../getOryComponents"
import type { OryClientConfiguration } from "../../../composables/useOryConfig"
import type { OryFlowComponentOverrides } from "../../../composables/useComponents"
import type { LoginFlowContainer } from "../../../util/flowContainer"

const props = defineProps<{
  flow: LoginFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}>()

const components = getOryComponents(props.components)
const flowContainer: LoginFlowContainer = {
  flow: props.flow,
  flowType: FlowType.Login,
}
</script>

<template>
  <OryProvider
    :flow-container="flowContainer"
    :config="config"
    :components="components"
  >
    <slot>
      <OrySelfServiceFlowCard />
    </slot>
  </OryProvider>
</template>
