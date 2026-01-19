<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiNode } from "@ory/client-fetch"
import { isUiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFormContext } from "../../../../composables/useOryFormContext"
import { useComponents } from "../../../../composables/useComponents"
import { OryNode } from "../../../../components"
import SettingsRemoveButton from "./SettingsRemoveButton.vue"
import ProviderLogo from "../ui/ProviderLogo.vue"

const props = defineProps<{
  nodes: UiNode[]
}>()

const formContext = useOryFormContext()
const components = useComponents()

const linkButtons = computed(() =>
  props.nodes.filter(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "link",
  ),
)

const unlinkButtons = computed(() =>
  props.nodes.filter(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "unlink",
  ),
)

function extractProvider(context: object | undefined): string {
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return ""
}

function getProviderFromValue(node: UiNode): string {
  if (isUiNodeInputAttributes(node.attributes)) {
    return String(node.attributes.value).split("-")[0]
  }
  return ""
}

function handleUnlink(node: UiNode, event: Event) {
  event.preventDefault()
  if (isUiNodeInputAttributes(node.attributes)) {
    formContext.setValue("unlink", node.attributes.value as string)
    formContext.setValue("method", node.group)
    void formContext.handleSubmit()
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div
      v-if="linkButtons.length > 0"
      class="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-3"
    >
      <template
        v-for="node in linkButtons"
        :key="
          isUiNodeInputAttributes(node.attributes)
            ? node.attributes.value
            : undefined
        "
      >
        <OryNode
          v-if="isUiNodeInputAttributes(node.attributes)"
          :node="node"
          :provider="getProviderFromValue(node)"
        />
      </template>
    </div>

    <component
      :is="components.Card.Divider"
      v-if="unlinkButtons.length > 0 && linkButtons.length > 0"
    />

    <template
      v-for="node in unlinkButtons"
      :key="
        isUiNodeInputAttributes(node.attributes)
          ? node.attributes.value
          : undefined
      "
    >
      <div
        v-if="isUiNodeInputAttributes(node.attributes)"
        class="flex justify-between"
      >
        <div class="flex items-center gap-6">
          <ProviderLogo
            :provider="getProviderFromValue(node)"
            :fallback-label="extractProvider(node.meta.label?.context)"
            :size="32"
          />
          <p
            class="text-sm font-medium text-interface-foreground-default-secondary"
          >
            {{ extractProvider(node.meta.label?.context) }}
          </p>
        </div>
        <SettingsRemoveButton
          :title="`Unlink ${extractProvider(node.meta.label?.context)}`"
          :disabled="formContext.isSubmitting.value"
          @click="(e) => handleUnlink(node, e)"
        />
      </div>
    </template>
  </div>
</template>
