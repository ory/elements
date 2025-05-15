// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useReducer, useState } from "react"
import { isChoosingMethod } from "../components/card/two-step/utils"
import { OryFlowContainer } from "../util"
import { nodesToAuthMethodGroups } from "../util/ui"

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
  | {
      type: "action_flow_update"
      flow: OryFlowContainer
    }
  | {
      type: "action_select_method"
      method: UiNodeGroupEnum
    }
  | {
      type: "action_clear_active_method"
    }

function findMethodWithMessage(nodes?: UiNode[]) {
  return nodes
    ?.filter((n) => !["default", "identifier_first"].includes(n.group))
    ?.find((node) => node.messages?.length > 0)
}

function parseStateFromFlow(flow: OryFlowContainer): FormState {
  switch (flow.flowType) {
    case FlowType.Registration:
    case FlowType.Login: {
      const methodWithMessage = findMethodWithMessage(flow.flow.ui.nodes)
      if (flow.flow.active == "link_recovery") {
        return { current: "method_active", method: "link" }
      } else if (flow.flow.active == "code_recovery") {
        return { current: "method_active", method: "code" }
      } else if (methodWithMessage) {
        return { current: "method_active", method: methodWithMessage.group }
      } else if (
        flow.flow.active &&
        !["default", "identifier_first"].includes(flow.flow.active)
      ) {
        return { current: "method_active", method: flow.flow.active }
      } else if (isChoosingMethod(flow)) {
        // Login has a special case where we only have one method. Here, we
        // do not want to display the chooser.
        const authMethods = nodesToAuthMethodGroups(flow.flow.ui.nodes)
        if (authMethods.length === 1 && authMethods[0] !== "code") {
          // TODO: https://github.com/ory/kratos/issues/4271 - once this is fixed in Kratos, we can remove the check for "code"
          return { current: "method_active", method: authMethods[0] }
        }
        return { current: "select_method" }
      } else if (flow.flow.ui.messages?.some((m) => m.id === 1010016)) {
        // Account linking edge case
        return { current: "select_method" }
      }
      return { current: "provide_identifier" }
    }
    case FlowType.Recovery:
    case FlowType.Verification:
      // The API does not provide types for the active field of the recovery flow
      // TODO: Add types for the recovery flow in Kratos
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
    `[Ory/Elements React] Encountered an unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}`,
  )
  throw new Error("Unknown form state")
}

export function useFormStateReducer(flow: OryFlowContainer) {
  const action = parseStateFromFlow(flow)
  const [selectedMethod, setSelectedMethod] = useState<
    UiNodeGroupEnum | undefined
  >()

  const formStateReducer = (
    state: FormState,
    action: FormStateAction,
  ): FormState => {
    switch (action.type) {
      case "action_flow_update": {
        if (selectedMethod) {
          return { current: "method_active", method: selectedMethod }
        }
        return parseStateFromFlow(action.flow)
      }
      case "action_select_method": {
        setSelectedMethod(action.method)
        return { current: "method_active", method: action.method }
      }
      case "action_clear_active_method": {
        return {
          current: "select_method",
        }
      }
    }
    return state
  }

  return useReducer(formStateReducer, action)
}
