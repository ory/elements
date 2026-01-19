<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import { UiNode, UiNodeGroupEnum, getNodeId } from "@ory/client-fetch"
import {
  useComponents,
  useNodeSorter,
} from "../../../composables/useComponents"
import { useOryFlow } from "../../../composables/useOryFlow"
import { withoutSingleSignOnNodes, isNodeVisible } from "../../../util/ui"
import OryCard from "../OryCard.vue"
import OryCardHeader from "../OryCardHeader.vue"
import OryCardContent from "../OryCardContent.vue"
import OryCardFooter from "../OryCardFooter.vue"
import OryForm from "../../form/OryForm.vue"
import OryFormSsoForm from "../../form/OryFormSsoForm.vue"
import OryMessages from "../../form/OryMessages.vue"
import OryNode from "../../form/nodes/OryNode.vue"
import { handleAfterFormSubmit } from "./utils"

const { Form, Card } = useComponents()
const { flowContainer, flowType, dispatchFormState } = useOryFlow()
const nodeSorter = useNodeSorter()

const sortNodes = (a: UiNode, b: UiNode) =>
  nodeSorter(a, b, { flowType: flowType.value })

const nonSsoNodes = computed(() =>
  withoutSingleSignOnNodes(flowContainer.value.flow.ui.nodes).sort(sortNodes),
)

const hasSso = computed(() =>
  flowContainer.value.flow.ui.nodes
    .filter(isNodeVisible)
    .some(
      (node) =>
        node.group === UiNodeGroupEnum.Oidc ||
        node.group === UiNodeGroupEnum.Saml,
    ),
)

const showSsoDivider = computed(
  () => hasSso.value && nonSsoNodes.value.some(isNodeVisible),
)
</script>

<template>
  <OryCard>
    <OryCardHeader />
    <OryCardContent>
      <OryMessages :messages="flowContainer.flow.ui.messages" />
      <OryFormSsoForm />
      <OryForm :on-after-submit="handleAfterFormSubmit(dispatchFormState)">
        <component :is="Form.Group">
          <component :is="Card.Divider" v-if="showSsoDivider" />
          <OryNode
            v-for="node in nonSsoNodes"
            :key="getNodeId(node)"
            :node="node"
          />
        </component>
      </OryForm>
    </OryCardContent>
    <OryCardFooter />
  </OryCard>
</template>
