<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { UiNode } from "@ory/client-fetch"
import {
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "@ory/client-fetch"
import { useOryFormContext } from "../../../../composables/useOryFormContext"
import { useComponents } from "../../../../composables/useComponents"
import { IconEye, IconRefresh, IconDownload } from "../../assets/icons"

const props = defineProps<{
  nodes: UiNode[]
}>()

const formContext = useOryFormContext()
const components = useComponents()

const codes = computed(() => {
  const textNodes = props.nodes.filter(
    (node) =>
      isUiNodeTextAttributes(node.attributes) &&
      node.attributes.id?.startsWith("lookup_secret_codes"),
  )
  return textNodes
    .map((node) => {
      if (isUiNodeTextAttributes(node.attributes)) {
        return String(node.attributes.text.text)
      }
      return ""
    })
    .filter((code) => code !== "")
})

const regenerateButton = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "lookup_secret_regenerate",
  ),
)

const revealButton = computed(() =>
  props.nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name === "lookup_secret_reveal",
  ),
)

const hasCodes = computed(() => codes.value.length >= 1)

function handleRegenerate(event: Event) {
  event.preventDefault()
  if (
    regenerateButton.value &&
    isUiNodeInputAttributes(regenerateButton.value.attributes)
  ) {
    formContext.setValue(
      regenerateButton.value.attributes.name,
      (regenerateButton.value.attributes.value as string | boolean) ?? true,
    )
    formContext.setValue("method", "lookup_secret")
    void formContext.handleSubmit()
  }
}

function handleReveal(event: Event) {
  event.preventDefault()
  if (
    revealButton.value &&
    isUiNodeInputAttributes(revealButton.value.attributes)
  ) {
    formContext.setValue(
      revealButton.value.attributes.name,
      (revealButton.value.attributes.value as string | boolean) ?? true,
    )
    formContext.setValue("method", "lookup_secret")
    void formContext.handleSubmit()
  }
}

function handleDownload() {
  const element = document.createElement("a")
  const file = new Blob([codes.value.join("\n")], {
    type: "text/plain",
  })
  element.href = URL.createObjectURL(file)
  element.download = "recovery-codes.txt"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <component :is="components.Card.Divider" v-if="hasCodes" />

    <div class="flex justify-between gap-4">
      <span class="text-interface-foreground-default-tertiary">
        {{ revealButton ? "Reveal recovery codes" : "" }}
      </span>

      <div class="flex gap-2">
        <button
          v-if="regenerateButton && hasCodes"
          type="button"
          class="ml-auto cursor-pointer"
          title="Regenerate recovery codes"
          :disabled="formContext.isSubmitting.value"
          :data-loading="formContext.isSubmitting.value"
          @click="handleRegenerate"
        >
          <IconRefresh
            :size="24"
            class="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
          />
        </button>

        <button
          v-if="revealButton"
          type="button"
          class="ml-auto cursor-pointer"
          title="Reveal recovery codes"
          :disabled="formContext.isSubmitting.value"
          @click="handleReveal"
        >
          <IconEye
            :size="24"
            class="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
          />
        </button>

        <button
          v-if="hasCodes"
          type="button"
          class="ml-auto cursor-pointer"
          data-testid="ory/screen/settings/group/recovery_code/download"
          title="Download recovery codes"
          @click="handleDownload"
        >
          <IconDownload
            :size="24"
            class="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
          />
        </button>
      </div>
    </div>

    <div
      v-if="hasCodes"
      class="rounded-general border-interface-border-default-primary bg-interface-background-default-secondary p-6"
    >
      <div
        class="grid grid-cols-2 flex-wrap gap-4 text-sm text-interface-foreground-default-primary sm:grid-cols-3 md:grid-cols-5"
        data-testid="ory/screen/settings/group/recovery_code/codes"
      >
        <p v-for="code in codes" :key="code">{{ code }}</p>
      </div>
    </div>
  </div>
</template>
