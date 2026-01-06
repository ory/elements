<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { FlowType } from "@ory/client-fetch"
import { useOryFlow } from "../../composables/useOryFlow"
import ProvideIdentifierForm from "./two-step/ProvideIdentifierForm.vue"
import SelectMethodForm from "./two-step/SelectMethodForm.vue"
import MethodActiveForm from "./two-step/MethodActiveForm.vue"

const { formState, flowType } = useOryFlow()
</script>

<template>
  <div v-if="flowType === FlowType.Settings">
    Settings flow not yet implemented
  </div>

  <template v-else>
    <ProvideIdentifierForm v-if="formState.current === 'provide_identifier'" />
    <SelectMethodForm v-else-if="formState.current === 'select_method'" />
    <MethodActiveForm
      v-else-if="formState.current === 'method_active'"
      :form-state="formState"
    />
    <div v-else>Unknown form state: {{ formState.current }}</div>
  </template>
</template>
