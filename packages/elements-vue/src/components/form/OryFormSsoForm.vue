<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import { UiNodeGroupEnum, getNodeId } from "@ory/client-fetch"
import { useComponents } from "../../composables/useComponents"
import { useOryForm } from "../../composables/useOryForm"
import { provideOryForm } from "../../composables/useOryFormContext"
import { useOryFlow } from "../../composables/useOryFlow"
import { isNodeVisible } from "../../util/ui"
import OryNode from "./nodes/OryNode.vue"

const { Form } = useComponents()
const { flowContainer } = useOryFlow()

const formContext = useOryForm({})
const { handleSubmit, action, method } = formContext

provideOryForm(formContext)

const ssoNodes = computed(() =>
  flowContainer.value.flow.ui.nodes.filter(
    (node) =>
      (node.group === UiNodeGroupEnum.Oidc ||
        node.group === UiNodeGroupEnum.Saml) &&
      isNodeVisible(node),
  ),
)
</script>

<template>
  <component
    v-if="ssoNodes.length > 0"
    :is="Form.Root"
    :action="action"
    :method="method"
    data-testid="ory/form/methods/oidc-saml"
    @submit="handleSubmit"
  >
    <component :is="Form.SsoRoot" :nodes="ssoNodes">
      <OryNode v-for="node in ssoNodes" :key="getNodeId(node)" :node="node" />
    </component>
  </component>
</template>
