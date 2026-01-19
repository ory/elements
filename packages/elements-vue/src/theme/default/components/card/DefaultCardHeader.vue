<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, useSlots } from "vue"
import { FlowType } from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useComponents } from "../../../../composables/useComponents"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useHasSlotContent } from "../../../../composables/useSlotContent"
import { useCardHeaderText } from "../../utils/constructCardHeader"
import { isConsentFlow } from "../../../../util/flowContainer"
import DefaultCurrentIdentifierButton from "./DefaultCurrentIdentifierButton.vue"

const { flowContainer, formState, flowType } = useOryFlow()
const { Card } = useComponents()
const intl = useOryIntl()
const slots = useSlots()

const t = (key: string, values?: Record<string, unknown>) =>
  String(intl.t(key, values))

const headerText = computed(() => {
  const flow = flowContainer.value.flow
  const ui = flow.ui

  if (flowType.value === FlowType.Login) {
    return useCardHeaderText(ui, {
      flowType: FlowType.Login as const,
      flow: {
        refresh: "refresh" in flow ? flow.refresh : false,
        requested_aal: "requested_aal" in flow ? flow.requested_aal : undefined,
      },
      formState: formState.value,
    }, t)
  }

  if (flowType.value === FlowType.Registration) {
    return useCardHeaderText(ui, {
      flowType: FlowType.Registration as const,
      formState: formState.value,
    }, t)
  }

  if (flowType.value === FlowType.OAuth2Consent && isConsentFlow(flow)) {
    return useCardHeaderText(ui, {
      flowType: FlowType.OAuth2Consent as const,
      flow: {
        consent_request: flow.consent_request,
        session: flow.session,
      },
    }, t)
  }

  return useCardHeaderText(ui, {
    flowType: flowType.value as
      | FlowType.Recovery
      | FlowType.Verification
      | FlowType.Settings
      | FlowType.Error,
  }, t)
})

const hasRealSlotContent = useHasSlotContent(slots)
</script>

<template>
  <header class="flex flex-col gap-8 antialiased">
    <slot v-if="hasRealSlotContent" />
    <template v-else>
      <component :is="Card.Logo" />
      <div class="flex flex-col gap-2">
        <h2
          class="text-lg leading-normal font-semibold text-interface-foreground-default-primary"
        >
          {{ headerText.title }}
        </h2>
        <p
          class="leading-normal text-interface-foreground-default-secondary"
          :data-testid="
            headerText.messageId
              ? `ory/form/message/${headerText.messageId}`
              : undefined
          "
        >
          {{ headerText.description }}
        </p>
        <DefaultCurrentIdentifierButton />
      </div>
    </template>
  </header>
</template>
