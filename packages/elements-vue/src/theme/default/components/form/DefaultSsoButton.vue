<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import { FlowType, UiNodeGroupEnum } from "@ory/client-fetch"
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { uiTextToFormattedMessage } from "../../utils/i18n"
import ProviderLogo from "../ui/ProviderLogo.vue"
import Spinner from "./Spinner.vue"

const props = withDefaults(
  defineProps<{
    node: UiNode
    attributes: UiNodeInputAttributes
    provider: string
    isSubmitting?: boolean
    isFormSubmitting?: boolean
    onClick?: (e: Event) => void
  }>(),
  {
    isSubmitting: false,
    isFormSubmitting: false,
  },
)

const intl = useOryIntl()
const t = (key: string, values?: Record<string, unknown>) =>
  String(intl.t(key, values))
const { flowContainer, flowType } = useOryFlow()

const ssoNodes = computed(() =>
  flowContainer.value.flow.ui.nodes.filter(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  ),
)

const ssoNodeCount = computed(() => ssoNodes.value.length)

const providerKey = computed(() =>
  (props.attributes.value as string).split("-")[0],
)

const providerDisplayName = computed(() => {
  const context = props.node.meta.label?.context
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return ""
})

const showLabel = computed(
  () =>
    flowType.value === FlowType.Settings ||
    (ssoNodeCount.value % 3 !== 0 && ssoNodeCount.value % 4 !== 0),
)

const label = computed(() =>
  props.node.meta.label
    ? uiTextToFormattedMessage(props.node.meta.label, t)
    : "",
)

function handleClick(e: Event) {
  props.onClick?.(e)
}
</script>

<template>
  <button
    type="submit"
    :name="attributes.name"
    :value="attributes.value"
    :disabled="attributes.disabled || isSubmitting || isFormSubmitting"
    class="flex cursor-pointer items-center justify-center gap-3 rounded-buttons border border-button-social-border-default bg-button-social-background-default px-4 py-[13px] transition-colors hover:border-button-social-border-hover hover:bg-button-social-background-hover hover:text-button-social-foreground-hover loading:border-button-social-border-disabled loading:bg-button-social-background-disabled loading:text-button-social-foreground-disabled"
    :data-testid="`ory/form/node/input/${attributes.name}`"
    :data-loading="isSubmitting"
    :aria-label="label"
    @click="handleClick"
  >
    <span class="relative size-5">
      <template v-if="!isSubmitting">
        <ProviderLogo
          :provider="providerKey"
          :fallback-label="providerDisplayName"
          :size="20"
        />
      </template>
      <Spinner v-else class="size-5" />
    </span>
    <template v-if="showLabel && node.meta.label">
      <span
        class="grow text-center leading-none font-medium text-button-social-foreground-default"
      >
        {{ label }}
      </span>
      <span class="block size-5"></span>
    </template>
  </button>
</template>
