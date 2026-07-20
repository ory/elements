<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiNode } from "@ory/client-fetch"
import { isUiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFormContext } from "../../../../composables/useOryFormContext"
import { useComponents } from "../../../../composables/useComponents"
import { IconPasskey } from "../../assets/icons"
import { OryNode } from "../../../../components"
import { getNodeContext, formatDate } from "./utils"
import SettingsRemoveButton from "./SettingsRemoveButton.vue"

const props = defineProps<{
  nodes: UiNode[]
}>()

const formContext = useOryFormContext()
const components = useComponents()

const triggerButton = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "passkey_register_trigger",
  ),
)

const settingsNodes = computed(() =>
  props.nodes.filter(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      (node.attributes.name === "passkey_settings_register" ||
        node.attributes.name === "passkey_create_data"),
  ),
)

const removeButtons = computed(() =>
  props.nodes.filter(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "passkey_remove",
  ),
)

function handleRemove(node: UiNode, event: Event) {
  event.preventDefault()
  if (isUiNodeInputAttributes(node.attributes)) {
    formContext.setValue(node.attributes.name, node.attributes.value as string)
    formContext.setValue("method", "passkey")
    void formContext.handleSubmit()
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <OryNode
      v-for="node in settingsNodes"
      :key="`passkey-settings-${(node.attributes as any).name}`"
      :node="node"
    />

    <div class="flex max-w-[60%] items-end gap-3">
      <OryNode v-if="triggerButton" :node="triggerButton" />
    </div>

    <div v-if="removeButtons.length > 0" class="flex flex-col gap-8">
      <component :is="components.Card.Divider" />

      <div class="flex flex-col gap-2">
        <div
          v-for="(node, i) in removeButtons"
          :key="`passkey-remove-button-${i}`"
          class="flex justify-between gap-6 md:items-center"
        >
          <div class="flex flex-1 items-center gap-2 truncate">
            <IconPasskey
              :size="32"
              class="text-interface-foreground-default-primary"
            />
            <div
              class="flex flex-1 flex-col gap-4 truncate md:flex-row md:items-center md:justify-between"
            >
              <div class="flex-1 flex-col truncate">
                <p
                  class="truncate text-sm font-medium text-interface-foreground-default-secondary"
                >
                  {{ getNodeContext(node).displayName ?? "" }}
                </p>
                <span
                  class="hidden truncate text-sm text-interface-foreground-default-tertiary sm:block"
                >
                  {{ getNodeContext(node).keyId }}
                </span>
              </div>
              <p
                v-if="getNodeContext(node).addedAt"
                class="text-sm text-interface-foreground-default-tertiary"
              >
                {{ formatDate(getNodeContext(node).addedAt!) }}
              </p>
            </div>
          </div>

          <SettingsRemoveButton
            :title="`Remove passkey ${getNodeContext(node).displayName ?? ''}`"
            :disabled="formContext.isSubmitting.value"
            @click="(e) => handleRemove(node, e)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
