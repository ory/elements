<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import {
  FlowType,
  getNodeLabel,
  instanceOfUiText,
  isUiNodeInputAttributes,
} from "@ory/client-fetch"
import type { UiNode, UiNodeInputAttributes, UiText } from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useOryConfig } from "../../../../composables/useOryConfig"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useComponents } from "../../../../composables/useComponents"
import { useResendCode } from "../../../../composables/useResendCode"
import { initFlowUrl } from "../../utils/url"
import { resolveLabel } from "../../utils/i18n"

const props = defineProps<{
  node: UiNode
  attributes: UiNodeInputAttributes
  fieldError?: UiText
}>()

const { flowContainer, formState, flowType } = useOryFlow()
const config = useOryConfig()
const intl = useOryIntl()
const { Message } = useComponents()
const { resendCode, resendCodeNode } = useResendCode()

const t = (key: string, values?: Record<string, unknown>) =>
  String(intl.t(key, values))

const showResendCode = computed(() => {
  if (!resendCodeNode.value) return false
  return props.attributes.name === "code"
})

const label = computed(() => getNodeLabel(props.node))

const labelText = computed(() => {
  const lbl = label.value
  return lbl ? resolveLabel(lbl, t) : null
})

const labelAction = computed(() => {
  const flow = flowContainer.value.flow
  const attrs = props.attributes

  if (
    flowType.value === FlowType.Login &&
    config.project?.recovery_enabled !== false
  ) {
    if (
      formState.value.current === "provide_identifier" &&
      !("refresh" in flow && flow.refresh)
    ) {
      if (attrs.name === "identifier") {
        return {
          message: t("forms.label.recover-account"),
          href: initFlowUrl(config.sdk.url, "recovery", flow),
          testId: "recover-account",
        }
      }
    } else if (attrs.type === "password") {
      return {
        message: t("forms.label.forgot-password"),
        href: initFlowUrl(config.sdk.url, "recovery", flow),
        testId: "forgot-password",
      }
    }
  }

  return null
})

const resendCodeAttrs = computed(() => {
  if (
    !resendCodeNode.value ||
    !isUiNodeInputAttributes(resendCodeNode.value.attributes)
  ) {
    return null
  }
  return resendCodeNode.value.attributes
})
</script>

<template>
  <div class="flex flex-col gap-1 antialiased">
    <span v-if="labelText" class="inline-flex justify-between">
      <label
        class="leading-normal text-input-foreground-primary"
        :for="attributes.name"
        :data-testid="`ory/form/node/input/label/${attributes.name}`"
      >
        {{ labelText }}
      </label>
      <a
        v-if="labelAction"
        :href="labelAction.href"
        class="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        :data-testid="`ory/screen/login/action/${labelAction.testId}`"
      >
        {{ labelAction.message }}
      </a>
      <button
        v-if="showResendCode && resendCodeAttrs"
        type="button"
        :name="resendCodeAttrs.name"
        :value="resendCodeAttrs.value"
        class="cursor-pointer text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        @click="resendCode"
      >
        {{ t("identities.messages.1070008") }}
      </button>
    </span>
    <slot />
    <component
      :is="Message.Content"
      v-for="message in node.messages || []"
      :key="message.id"
      :message="message"
    />
    <component
      :is="Message.Content"
      v-if="fieldError && instanceOfUiText(fieldError)"
      :message="fieldError"
    />
  </div>
</template>
