<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, watch } from "vue"
import {
  FlowType,
  isUiNodeInputAttributes,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeScriptAttributes,
} from "@ory/client-fetch"
import { useComponents } from "../../composables/useComponents"
import { useOryForm } from "../../composables/useOryForm"
import { provideOryForm } from "../../composables/useOryFormContext"
import { useOryFlow } from "../../composables/useOryFlow"
import { useOryIntl } from "../../composables/useOryIntl"

const props = defineProps<{
  onAfterSubmit?: (method: string | number | boolean | undefined) => void
}>()

const components = useComponents()
const { flowContainer, formState, flowType } = useOryFlow()
const intl = useOryIntl()
const formContext = useOryForm({
  onAfterSubmit: props.onAfterSubmit,
})
const { handleSubmit, action, method, setValue } = formContext

provideOryForm(formContext)

const hasMethods = computed(() =>
  flowContainer.value.flow.ui.nodes.some((node) => {
    if (isUiNodeInputAttributes(node.attributes)) {
      if (node.attributes.type === "hidden") {
        return false
      }
      return node.attributes.name !== "csrf_token"
    } else if (isUiNodeAnchorAttributes(node.attributes)) {
      return true
    } else if (isUiNodeImageAttributes(node.attributes)) {
      return true
    } else if (isUiNodeScriptAttributes(node.attributes)) {
      return true
    }
    return false
  }),
)

const noMethodsMessage = computed(() => {
  const translationKey = "identities.messages.5000002"
  const defaultMessage =
    "No authentication methods are available for this request. Please contact the site or app owner."
  const translated = intl.t(translationKey)
  return {
    id: 5000002,
    text: translated === translationKey ? defaultMessage : translated,
    type: "error" as const,
  }
})

/**
 * Method field enforcement for code flows.
 * Sometimes the method input node is missing, so we force set it here.
 * This mirrors React's implementation in form.tsx.
 */
watch(
  [flowType, formState],
  ([type, state]) => {
    if (
      (type === FlowType.Login || type === FlowType.Registration) &&
      state.current === "method_active" &&
      state.method === "code"
    ) {
      setValue("method", "code")
    }
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="!hasMethods">
    <component :is="components.Message.Root">
      <component
        :is="components.Message.Content"
        :message="noMethodsMessage"
      />
    </component>
  </template>
  <component
    v-else
    :is="components.Form.Root"
    :action="action"
    :method="method"
    @submit="handleSubmit"
  >
    <slot />
  </component>
</template>
