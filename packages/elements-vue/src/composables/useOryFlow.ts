// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import {
  inject,
  provide,
  ref,
  computed,
  type InjectionKey,
  type Ref,
} from "vue"
import { OryFlowContainer } from "../util/flowContainer"
import { nodesToAuthMethodGroups } from "../util/ui"

/**
 * Form state types
 */
export type FormStateSelectMethod = { current: "select_method" }
export type FormStateProvideIdentifier = { current: "provide_identifier" }
export type FormStateMethodActive = {
  current: "method_active"
  method: UiNodeGroupEnum
}

export type FormState =
  | FormStateSelectMethod
  | FormStateProvideIdentifier
  | FormStateMethodActive
  | { current: "success_screen" }
  | { current: "settings" }

export type FormStateAction =
  | { type: "action_flow_update"; flow: OryFlowContainer }
  | { type: "action_select_method"; method: UiNodeGroupEnum }
  | { type: "action_clear_active_method" }

/**
 * Flow context value type
 */
export type FlowContextValue = {
  flowContainer: Ref<OryFlowContainer>
  flowType: Ref<FlowType>
  formState: Ref<FormState>
  setFlowContainer: (container: OryFlowContainer) => void
  dispatchFormState: (action: FormStateAction) => void
}

const OryFlowKey: InjectionKey<FlowContextValue> = Symbol("OryFlow")

function findMethodWithMessage(nodes?: UiNode[]) {
  return nodes
    ?.filter((n) => !["default", "identifier_first"].includes(n.group))
    ?.find((node) => node.messages?.length > 0)
}

/**
 * Check if node is a screen selection node (back button or hidden identifier)
 */
function isScreenSelectionNode(node: UiNode) {
  if (
    "name" in node.attributes &&
    node.attributes.name === "screen" &&
    "value" in node.attributes &&
    node.attributes.value === "previous"
  ) {
    return true
  }
  if (
    node.group === UiNodeGroupEnum.IdentifierFirst &&
    "name" in node.attributes &&
    node.attributes.name === "identifier" &&
    (node.attributes as { type?: string }).type === "hidden"
  ) {
    return true
  }
  return false
}

/**
 * Check if the flow is in a state where the user should choose a method (2FA)
 */
function isChoosingMethod(flow: OryFlowContainer): boolean {
  if (flow.flowType === FlowType.Login) {
    // AAL2 (2FA) flows should show method selection
    if ((flow.flow as { requested_aal?: string }).requested_aal === "aal2") {
      return true
    }
    // Refresh flows (except code flows) should show method selection
    if (
      (flow.flow as { refresh?: boolean }).refresh &&
      !flow.flow.ui.nodes.some((n) => n.group === "code")
    ) {
      return true
    }
  }
  return flow.flow.ui.nodes.some(isScreenSelectionNode)
}

function parseStateFromFlow(flow: OryFlowContainer): FormState {
  switch (flow.flowType) {
    case FlowType.Registration:
    case FlowType.Login: {
      const methodWithMessage = findMethodWithMessage(flow.flow.ui.nodes)

      if (flow.flow.active === "link_recovery") {
        return { current: "method_active", method: "link" }
      } else if (flow.flow.active === "code_recovery") {
        return { current: "method_active", method: "code" }
      } else if (methodWithMessage) {
        return { current: "method_active", method: methodWithMessage.group }
      } else if (flow.flow.ui.messages?.some((m) => m.id === 1010016)) {
        // Account linking edge case
        return { current: "select_method" }
      } else if (
        flow.flow.active &&
        !["default", "identifier_first"].includes(flow.flow.active)
      ) {
        return { current: "method_active", method: flow.flow.active }
      } else if (isChoosingMethod(flow)) {
        // Method selection: AAL2 (2FA), refresh, or identifier_first second step
        // Check available auth methods to determine if we show selection or skip to single method
        const authMethods = nodesToAuthMethodGroups(flow.flow.ui.nodes)
        // If only one method and it's not code or passkey, skip method selection
        if (
          authMethods.length === 1 &&
          !["code", "passkey"].includes(authMethods[0])
        ) {
          return { current: "method_active", method: authMethods[0] }
        }
        return { current: "select_method" }
      }
      return { current: "provide_identifier" }
    }
    case FlowType.Recovery:
    case FlowType.Verification:
      if (flow.flow.active === "code" || flow.flow.active === "link") {
        if (flow.flow.state === "choose_method") {
          return { current: "provide_identifier" }
        }
        return { current: "method_active", method: flow.flow.active }
      }
      break
    case FlowType.Settings:
      return { current: "settings" }
    case FlowType.OAuth2Consent:
      return { current: "method_active", method: "oauth2_consent" }
  }
  console.warn(
    `[Ory/Elements Vue] Encountered an unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}`,
  )
  throw new Error("Unknown form state")
}

/**
 * Provide the Ory flow context to child components
 */
export function provideOryFlow(initialContainer: OryFlowContainer) {
  const flowContainer = ref<OryFlowContainer>(initialContainer)
  const selectedMethod = ref<UiNodeGroupEnum | undefined>()
  const formState = ref<FormState>(parseStateFromFlow(initialContainer))

  const flowType = computed(() => flowContainer.value.flowType)

  const setFlowContainer = (container: OryFlowContainer) => {
    flowContainer.value = container
    if (selectedMethod.value) {
      formState.value = {
        current: "method_active",
        method: selectedMethod.value,
      }
    } else {
      formState.value = parseStateFromFlow(container)
    }
  }

  const dispatchFormState = (action: FormStateAction) => {
    switch (action.type) {
      case "action_flow_update":
        if (selectedMethod.value) {
          formState.value = {
            current: "method_active",
            method: selectedMethod.value,
          }
        } else {
          formState.value = parseStateFromFlow(action.flow)
        }
        break
      case "action_select_method":
        selectedMethod.value = action.method
        formState.value = { current: "method_active", method: action.method }
        break
      case "action_clear_active_method":
        selectedMethod.value = undefined
        formState.value = { current: "select_method" }
        break
    }
  }

  const context: FlowContextValue = {
    flowContainer,
    flowType,
    formState,
    setFlowContainer,
    dispatchFormState,
  }

  provide(OryFlowKey, context)

  return context
}

/**
 * Use the Ory flow context in a component
 */
export function useOryFlow(): FlowContextValue {
  const context = inject(OryFlowKey)
  if (!context) {
    throw new Error(
      "useOryFlow must be used within a component that has called provideOryFlow",
    )
  }
  return context
}
