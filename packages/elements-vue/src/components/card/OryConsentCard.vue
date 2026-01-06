<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { getNodeId } from "@ory/client-fetch"
import { useComponents } from "../../composables/useComponents"
import { useOryFlow } from "../../composables/useOryFlow"
import OryCard from "./OryCard.vue"
import OryCardHeader from "./OryCardHeader.vue"
import OryCardContent from "./OryCardContent.vue"
import OryCardFooter from "./OryCardFooter.vue"
import OryForm from "../form/OryForm.vue"
import OryNode from "../form/nodes/OryNode.vue"

const { Form, Card } = useComponents()
const { flowContainer } = useOryFlow()
</script>

<template>
  <OryCard>
    <OryCardHeader />
    <OryCardContent>
      <OryForm>
        <component :is="Card.Divider" />
        <component :is="Form.Group">
          <OryNode
            v-for="node in flowContainer.flow.ui.nodes"
            :key="getNodeId(node)"
            :node="node"
          />
        </component>
        <component :is="Card.Divider" />
        <OryCardFooter />
      </OryForm>
    </OryCardContent>
  </OryCard>
</template>
