<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import type { OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import { FlowType } from "@ory/client-fetch"
import { OryProvider, OryConsentCard } from "../../../components"
import { getOryComponents } from "../getOryComponents"
import { translateConsentChallengeToUiNodes } from "../utils/oauth2"
import type { OryClientConfiguration } from "../../../composables/useOryConfig"
import type { OryFlowComponentOverrides } from "../../../composables/useComponents"
import type { ConsentFlowContainer } from "../../../util/flowContainer"

const props = defineProps<{
  consentChallenge: OAuth2ConsentRequest
  session: Session
  config: OryClientConfiguration
  csrfToken: string
  formActionUrl: string
  components?: OryFlowComponentOverrides
}>()

const components = getOryComponents(props.components)
const flow = translateConsentChallengeToUiNodes(
  props.consentChallenge,
  props.csrfToken,
  props.formActionUrl,
  props.session,
)
const flowContainer: ConsentFlowContainer = {
  flow,
  flowType: FlowType.OAuth2Consent,
}
</script>

<template>
  <OryProvider
    :flow-container="flowContainer"
    :config="config"
    :components="components"
  >
    <slot>
      <OryConsentCard />
    </slot>
  </OryProvider>
</template>
