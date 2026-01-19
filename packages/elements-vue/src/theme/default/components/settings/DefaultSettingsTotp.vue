<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { UiNode } from "@ory/client-fetch"
import {
  isUiNodeInputAttributes,
  isUiNodeImageAttributes,
  isUiNodeTextAttributes,
} from "@ory/client-fetch"
import { useOryFormContext } from "../../../../composables/useOryFormContext"
import { useComponents } from "../../../../composables/useComponents"
import Icon from "../ui/Icon.vue"
import { OryNode } from "../../../../components"
import PinInput from "../form/PinInput.vue"
import SettingsRemoveButton from "./SettingsRemoveButton.vue"

const props = defineProps<{
  nodes: UiNode[]
}>()

const formContext = useOryFormContext()
const components = useComponents()
const totpCode = ref("")

watch(totpCode, (newValue) => {
  formContext.setValue("totp_code", newValue)
})

const totpImage = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeImageAttributes(node.attributes) &&
      node.attributes.id === "totp_qr",
  ),
)

const totpSecret = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeTextAttributes(node.attributes) &&
      node.attributes.id === "totp_secret_key",
  ),
)

const totpInput = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "totp_code",
  ),
)

const totpUnlink = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "totp_unlink",
  ),
)

const secretText = computed(() => {
  if (totpSecret.value && isUiNodeTextAttributes(totpSecret.value.attributes)) {
    return totpSecret.value.attributes.text.text
  }
  return ""
})

function handleUnlink(event: Event) {
  event.preventDefault()
  if (
    totpUnlink.value &&
    isUiNodeInputAttributes(totpUnlink.value.attributes)
  ) {
    formContext.setValue(
      totpUnlink.value.attributes.name,
      totpUnlink.value.attributes.value as string,
    )
    formContext.setValue("method", "totp")
    void formContext.handleSubmit()
  }
}
</script>

<template>
  <div v-if="totpUnlink" class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <div class="col-span-full">
      <component :is="components.Card.Divider" />
    </div>
    <div class="col-span-full flex items-center gap-6">
      <div class="aspect-square size-8">
        <Icon name="qr-code" :size="32" />
      </div>
      <div class="mr-auto flex flex-col">
        <p
          class="text-sm font-medium text-interface-foreground-default-primary"
        >
          Authenticator app
        </p>
      </div>
      <SettingsRemoveButton
        title="Unlink TOTP Authenticator App"
        :disabled="formContext.isSubmitting.value"
        @click="handleUnlink"
      />
    </div>
  </div>

  <div
    v-else-if="totpImage && totpSecret && totpInput"
    class="grid grid-cols-1 gap-8 md:grid-cols-2"
  >
    <div class="col-span-full">
      <component :is="components.Card.Divider" />
    </div>

    <div
      class="flex justify-center rounded-cards bg-interface-background-default-secondary p-8"
    >
      <div class="aspect-square h-44 bg-[white]">
        <div class="-m-3 antialiased mix-blend-multiply">
          <OryNode :node="totpImage" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-1 antialiased">
        <label
          class="leading-normal text-input-foreground-primary"
          for="totp_secret_key"
        >
          Authenticator Secret
        </label>
        <div class="relative flex max-w-[488px] justify-stretch">
          <input
            type="text"
            disabled
            name="totp_secret_key"
            :value="secretText"
            class="w-full max-w-[488px] rounded-forms border border-input-border-disabled bg-input-background-disabled px-4 py-[13px] leading-tight text-input-foreground-disabled antialiased transition-colors"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1 antialiased">
        <label
          class="leading-normal text-input-foreground-primary"
          for="totp_code"
        >
          Verify code
        </label>
        <PinInput
          v-model="totpCode"
          name="totp_code"
          :length="6"
          :disabled="formContext.isSubmitting.value"
          :has-error="totpInput.messages.length > 0"
          class="max-w-[488px]"
        />
        <component
          :is="components.Message.Content"
          v-for="message in totpInput.messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>
  </div>
</template>
