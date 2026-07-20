<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import {
  FlowType,
  isUiNodeInputAttributes,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useOryConfig } from "../../../../composables/useOryConfig"
import { restartFlowUrl } from "../../utils/url"

const { flowContainer, formState, flowType } = useOryFlow()
const config = useOryConfig()

const backButtonCandidates = [
  "traits.email",
  "traits.username",
  "traits.phone_number",
]

function getBackButtonNodeAttributes(
  flowTypeValue: FlowType,
  nodes: UiNode[],
): UiNodeInputAttributes | undefined {
  let nodeBackButtonAttributes: UiNodeInputAttributes | undefined

  switch (flowTypeValue) {
    case FlowType.Login:
      nodeBackButtonAttributes = nodes.find(
        (node) =>
          isUiNodeInputAttributes(node.attributes) &&
          node.attributes.name === "identifier" &&
          ["default", "identifier_first"].includes(node.group),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Registration:
      nodeBackButtonAttributes = nodes.find(
        (node) =>
          isUiNodeInputAttributes(node.attributes) &&
          backButtonCandidates.includes(node.attributes.name) &&
          node.group === "default",
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Recovery:
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          !!n.attributes.value &&
          ["email", "recovery_confirm_address", "recovery_address"].includes(
            n.attributes.name,
          ),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Verification:
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          n.attributes.name === "email",
      )?.attributes as UiNodeInputAttributes | undefined
      break
  }

  if (
    nodeBackButtonAttributes?.node_type !== "input" ||
    !nodeBackButtonAttributes?.value
  ) {
    return undefined
  }

  return nodeBackButtonAttributes
}

const backButtonInfo = computed(() => {
  const flow = flowContainer.value.flow
  const nodes = flow.ui.nodes

  if (formState.value.current === "provide_identifier") {
    return null
  }

  if (flowType.value === FlowType.Login) {
    const loginFlow = flow as { requested_aal?: string; refresh?: boolean }
    if (loginFlow.requested_aal === "aal2" || loginFlow.refresh) {
      return null
    }
  }

  const attrs = getBackButtonNodeAttributes(flowType.value, nodes)
  if (!attrs || !attrs.value) {
    return null
  }

  const initFlowUrl = restartFlowUrl(
    flow,
    `${config.sdk.url}/self-service/${flowType.value}/browser`,
  )

  return {
    value: String(attrs.value),
    href: initFlowUrl,
  }
})
</script>

<template>
  <a
    v-if="backButtonInfo"
    class="group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px] transition-colors hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover"
    :href="backButtonInfo.href"
    :title="`Adjust ${backButtonInfo.value}`"
    :data-testid="`ory/screen/${flowType}/action/restart`"
  >
    <span
      class="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      <span
        class="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
      >
        {{ backButtonInfo.value }}
      </span>
    </span>
  </a>
</template>
