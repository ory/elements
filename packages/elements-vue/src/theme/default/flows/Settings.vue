<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { SettingsFlow, Session } from "@ory/client-fetch"
import { FlowType } from "@ory/client-fetch"
import {
  OryProvider,
  OrySettingsCard,
  OryPageHeader,
} from "../../../components"
import { getOryComponents } from "../getOryComponents"
import type { OryClientConfiguration } from "../../../composables/useOryConfig"
import type { OryFlowComponentOverrides } from "../../../composables/useComponents"
import type { SettingsFlowContainer } from "../../../util/flowContainer"
import { provideSession } from "../../../client/useSession"

const props = withDefaults(
  defineProps<{
    flow: SettingsFlow
    components?: OryFlowComponentOverrides
    config: OryClientConfiguration
    className?: string
    session?: Session | null
  }>(),
  {
    session: null,
  },
)

const components = getOryComponents(props.components)
const flowContainer: SettingsFlowContainer = {
  flow: props.flow,
  flowType: FlowType.Settings,
}

provideSession({ session: props.session, baseUrl: props.config.sdk?.url })
</script>

<template>
  <OryProvider
    :flow-container="flowContainer"
    :config="config"
    :components="components"
  >
    <slot>
      <div :class="['ory-elements', className]">
        <div
          class="flex flex-col items-center justify-start gap-8 pb-12 font-sans-default"
        >
          <OryPageHeader />
          <OrySettingsCard />
        </div>
      </div>
    </slot>
  </OryProvider>
</template>
