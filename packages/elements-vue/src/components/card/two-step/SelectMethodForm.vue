<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import {
  UiNode,
  UiNodeGroupEnum,
  UiText,
  isUiNodeScriptAttributes,
  getNodeId,
} from "@ory/client-fetch"
import {
  useComponents,
  useNodeSorter,
} from "../../../composables/useComponents"
import { useOryFlow } from "../../../composables/useOryFlow"
import {
  findNode,
  getFunctionalNodes,
  getNodeGroupsWithVisibleNodes,
  hasSingleSignOnNodes,
} from "../../../util/ui"
import OryCard from "../OryCard.vue"
import OryCardHeader from "../OryCardHeader.vue"
import OryCardContent from "../OryCardContent.vue"
import OryCardFooter from "../OryCardFooter.vue"
import OryForm from "../../form/OryForm.vue"
import OryFormSsoForm from "../../form/OryFormSsoForm.vue"
import OryMessages from "../../form/OryMessages.vue"
import OryNode from "../../form/nodes/OryNode.vue"
import { handleAfterFormSubmit, toAuthMethodPickerOptions } from "./utils"

const { Form, Card, Message } = useComponents()
const { flowContainer, flowType, dispatchFormState } = useOryFlow()
const nodeSorter = useNodeSorter()

const sortNodes = (a: UiNode, b: UiNode) =>
  nodeSorter(a, b, { flowType: flowType.value })

const visibleGroups = computed(() =>
  getNodeGroupsWithVisibleNodes(flowContainer.value.flow.ui.nodes),
)

const authMethodBlocks = computed(() =>
  toAuthMethodPickerOptions(visibleGroups.value),
)

const authMethodAdditionalNodes = computed(() =>
  getFunctionalNodes(flowContainer.value.flow.ui.nodes),
)

const hiddenNodes = computed(() =>
  flowContainer.value.flow.ui.nodes.filter(
    (n) =>
      n.group !== UiNodeGroupEnum.Captcha &&
      ((n.attributes.node_type === "input" && n.attributes.type === "hidden") ||
        isUiNodeScriptAttributes(n.attributes)),
  ),
)

const authMethodBlocksWithCode = computed(() => {
  const blocks = { ...authMethodBlocks.value }
  if (UiNodeGroupEnum.Code in blocks) {
    let identifier: string | undefined = findNode(
      flowContainer.value.flow.ui.nodes,
      {
        group: UiNodeGroupEnum.IdentifierFirst,
        node_type: "input",
        name: "identifier",
      },
    )?.attributes?.value as string | undefined
    identifier ||= findNode(flowContainer.value.flow.ui.nodes, {
      group: UiNodeGroupEnum.Code,
      node_type: "input",
      name: "address",
    })?.attributes?.value as string | undefined
    if (identifier) {
      blocks[UiNodeGroupEnum.Code] = {
        title: {
          id: "identities.messages.1010023",
          values: { address: String(identifier) },
        },
      }
    }
  }
  return blocks
})

const hasAuthMethods = computed(
  () => Object.entries(authMethodBlocksWithCode.value).length > 0,
)

const noMethodsMessage: UiText = {
  id: 5000002,
  text: "No authentication methods are available for this request. Please contact the site or app owner.",
  type: "error",
}

function handleMethodClick(group: string) {
  dispatchFormState({
    type: "action_select_method",
    method: group as UiNodeGroupEnum,
  })
}
</script>

<template>
  <OryCard>
    <OryCardHeader />
    <OryCardContent>
      <OryMessages :messages="flowContainer.flow.ui.messages" />
      <OryFormSsoForm />
      <OryForm
        v-if="hasAuthMethods"
        :on-after-submit="handleAfterFormSubmit(dispatchFormState)"
      >
        <component :is="Form.Group">
          <component :is="Card.Divider" />
          <component :is="Card.AuthMethodListContainer">
            <component
              :is="Card.AuthMethodListItem"
              v-for="[group, options] in Object.entries(
                authMethodBlocksWithCode,
              )"
              :key="group"
              :group="group as UiNodeGroupEnum"
              :title="options.title"
              @click="handleMethodClick(group)"
            >
              {{ group }}
            </component>
          </component>
          <OryNode
            v-for="node in authMethodAdditionalNodes.sort(sortNodes)"
            :key="getNodeId(node)"
            :node="node"
          />
        </component>
        <OryNode
          v-for="node in hiddenNodes"
          :key="getNodeId(node)"
          :node="node"
        />
      </OryForm>

      <div
        v-else-if="!hasSingleSignOnNodes(flowContainer.flow.ui.nodes)"
        data-testid="ory/form/methods/local"
      >
        <component :is="Message.Root">
          <component
            :is="Message.Content"
            :key="noMethodsMessage.id"
            :message="noMethodsMessage"
          />
        </component>
      </div>
    </OryCardContent>
    <OryCardFooter />
  </OryCard>
</template>
