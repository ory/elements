<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import {
  UiNode,
  UiNodeGroupEnum,
  isUiNodeScriptAttributes,
  isUiNodeInputAttributes,
  getNodeId,
} from "@ory/client-fetch"
import {
  useComponents,
  useNodeSorter,
} from "../../../composables/useComponents"
import {
  useOryFlow,
  type FormStateMethodActive,
} from "../../../composables/useOryFlow"
import { getNodeGroupsWithVisibleNodes } from "../../../util/ui"
import OryCard from "../OryCard.vue"
import OryCardHeader from "../OryCardHeader.vue"
import OryCardContent from "../OryCardContent.vue"
import OryCardFooter from "../OryCardFooter.vue"
import OryForm from "../../form/OryForm.vue"
import OryMessages from "../../form/OryMessages.vue"
import OryNode from "../../form/nodes/OryNode.vue"
import { getFinalNodes, handleAfterFormSubmit } from "./utils"

const props = defineProps<{
  formState: FormStateMethodActive
}>()

const { Form } = useComponents()
const { flowContainer, flowType, dispatchFormState } = useOryFlow()
const nodeSorter = useNodeSorter()

const sortNodes = (a: UiNode, b: UiNode) =>
  nodeSorter(a, b, { flowType: flowType.value })

const groupsToShow = computed(() =>
  getNodeGroupsWithVisibleNodes(flowContainer.value.flow.ui.nodes),
)

const finalNodes = computed(() =>
  getFinalNodes(groupsToShow.value, props.formState.method),
)

const defaultAndProfileNodes = computed(() =>
  flowContainer.value.flow.ui.nodes.filter((n) => {
    if (isUiNodeScriptAttributes(n.attributes)) {
      return true
    }
    if (n.group === UiNodeGroupEnum.Profile) {
      return true
    }
    if (n.group === UiNodeGroupEnum.Default) {
      if (isUiNodeInputAttributes(n.attributes)) {
        const type = n.attributes.type
        if (type === "submit" || type === "button") {
          return false
        }
      }
      return true
    }
    return false
  }),
)
</script>

<template>
  <OryCard>
    <OryCardHeader />
    <OryCardContent>
      <OryMessages :messages="flowContainer.flow.ui.messages" />
      <OryForm :on-after-submit="handleAfterFormSubmit(dispatchFormState)">
        <component :is="Form.Group">
          <OryNode
            v-for="node in defaultAndProfileNodes"
            :key="getNodeId(node)"
            :node="node"
          />
          <OryNode
            v-for="node in finalNodes.sort(sortNodes)"
            :key="getNodeId(node)"
            :node="node"
          />
        </component>
      </OryForm>
    </OryCardContent>
    <OryCardFooter />
  </OryCard>
</template>
