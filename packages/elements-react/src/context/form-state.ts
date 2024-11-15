// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNodeGroupEnum } from "@ory/client-fetch"
import { useReducer } from "react"
import { isChoosingMethod } from "../components/card/card-two-step.utils"
import { OryFlowContainer } from "../util"

export type FormState =
  | { current: "provide_identifier" }
  | { current: "select_method" }
  | { current: "method_active"; method: UiNodeGroupEnum }
  | { current: "success_screen" }
  | { current: "impossible_unknown" }

export type FormStateAction =
  | {
      type: "action_flow_update"
      flow: OryFlowContainer
    }
  | {
      type: "action_select_method"
      method: UiNodeGroupEnum
    }

function parseStateFromFlow(flow: OryFlowContainer): FormState {
  switch (flow.flowType) {
    case FlowType.Registration:
    case FlowType.Login:
      if (flow.flow.active == "link_recovery") {
        return { current: "method_active", method: "link" }
      } else if (flow.flow.active == "code_recovery") {
        return { current: "method_active", method: "code" }
      } else if (flow.flow.active) {
        return { current: "method_active", method: flow.flow.active }
      } else if (isChoosingMethod(flow.flow.ui.nodes)) {
        return { current: "select_method" }
      }
      return { current: "provide_identifier" }
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
  }
  console.warn(
    `[Ory/Elements React] Encountered an unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}`,
  )
  return { current: "impossible_unknown" }
}

export function formStateReducer(
  state: FormState,
  action: FormStateAction,
): FormState {
  switch (action.type) {
    case "action_flow_update":
      return parseStateFromFlow(action.flow)
    case "action_select_method":
      return { current: "method_active", method: action.method }
  }
  return state
}

export function useFormStateReducer(flow: OryFlowContainer) {
  return useReducer(formStateReducer, parseStateFromFlow(flow))
}
