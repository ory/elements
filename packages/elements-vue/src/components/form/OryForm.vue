<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { watch } from "vue"
import { FlowType } from "@ory/client-fetch"
import { useComponents } from "../../composables/useComponents"
import { useOryForm } from "../../composables/useOryForm"
import { provideOryForm } from "../../composables/useOryFormContext"
import { useOryFlow } from "../../composables/useOryFlow"

const props = defineProps<{
  onAfterSubmit?: (method: string | number | boolean | undefined) => void
}>()

const components = useComponents()
const { formState, flowType } = useOryFlow()
const formContext = useOryForm({
  onAfterSubmit: props.onAfterSubmit,
})
const { handleSubmit, action, method, setValue } = formContext

provideOryForm(formContext)

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
  <component
    :is="components.Form.Root"
    :action="action"
    :method="method"
    @submit="handleSubmit"
  >
    <slot />
  </component>
</template>
