// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useReducer, useState } from "react"
import { isChoosingMethod } from "../components/card/two-step/utils"
import { OryFlowContainer } from "../util"
import { nodesToAuthMethodGroups } from "../util/ui"

/**
 * Represents the state of the form when selecting an authentication method.
 * This type is used when the user is in the process of selecting an authentication method
 * (e.g., password, passkey, etc.) during the login or registration flow.
 * @inline
 * @hidden
 */
export type FormStateSelectMethod = { current: "select_method" }
/**
 * Represents the state of the form when providing an identifier.
 * This type is used when the user is required to provide an identifier (e.g., email or username)
 * before proceeding with the authentication flow.
 * @inline
 * @hidden
 */
export type FormStateProvideIdentifier = { current: "provide_identifier" }
/**
 * Represents the state of the form when an authentication method is active.
 * This type is used when the user is interacting with a specific authentication method
 * (e.g., entering a password or entering a code received via email).
 *
 * The `method` field indicates which authentication method is currently active.
 * @inline
 * @hidden
 */
export type FormStateMethodActive = {
  current: "method_active"
  method: UiNodeGroupEnum
}

/**
 * Represents the state of the form based on the flow type and active method.
 * This type is used to determine which part of the form should be displayed.
 *
 * It can be one of the following:
 * - `select_method`: The user is selecting an authentication method.
 * - `provide_identifier`: The user is providing an identifier (e.g., email or username).
 * - `method_active`: An authentication method is active, and the user is interacting with it.
 * - `success_screen`: The flow has successfully completed (only used in the verification flow).
 * - `settings`: The user is in the settings flow.
 */
export type FormState =
  | FormStateSelectMethod
  | FormStateProvideIdentifier
  | FormStateMethodActive
  | { current: "success_screen" }
  | { current: "settings" }

/**
 * Represents the actions that can be dispatched to update the form state.
 * These actions are used to change the current state of the form based on user interactions or flow updates.
 */
export type FormStateAction =
  | {
      /**
       * Action to update the flow state.
       * This action is dispatched when the flow is updated, and it will parse the new flow
       * to determine the current form state.
       */
      type: "action_flow_update"
      /**
       * The updated flow container that contains the new flow data.
       */
      flow: OryFlowContainer
    }
  | {
      /**
       * Action to select an authentication method.
       * This action is dispatched when the user selects an authentication method
       * (e.g., password, passkey, etc.) from the available options.
       */
      type: "action_select_method"
      /**
       * The authentication method that the user has selected.
       */
      method: UiNodeGroupEnum
    }
  | {
      /**
       * Action to clear the active authentication method.
       * This action is dispatched when the user wants to clear the currently active method
       * and return to the method selection state.
       */
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
      } else if (flow.flow.ui.messages?.some((m) => m.id === 1010016)) {
        // Account linking edge case
        return { current: "select_method" }
      } else if (
        flow.flow.active &&
        !["default", "identifier_first"].includes(flow.flow.active)
      ) {
        return { current: "method_active", method: flow.flow.active }
      } else if (isChoosingMethod(flow)) {
        // Login has a special case where we only have one method. Here, we
        // do not want to display the chooser.
        const authMethods = nodesToAuthMethodGroups(flow.flow.ui.nodes)
        if (
          authMethods.length === 1 &&
          !["code", "passkey"].includes(authMethods[0])
        ) {
          // TODO: https://github.com/ory/kratos/issues/4271 - once this is fixed in Kratos, we can remove the check for "code"
          return { current: "method_active", method: authMethods[0] }
        }
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

/**
 * The `useFormStateReducer` hook manages the state of the form based on the flow data.
 *
 * It uses a reducer to handle actions that update the form state, such as selecting an authentication method or updating the flow.
 *
 * @see FormState
 * @see FormStateAction
 * @param flow - The flow container that contains the flow data.
 * @returns a tuple containing the current form state and a dispatch function to update the state.
 */
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
