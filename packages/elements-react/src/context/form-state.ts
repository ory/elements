// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { Dispatch, useMemo, useReducer } from "react"
import { isChoosingMethod } from "../components/card/two-step/utils"
import { OryFlowContainer } from "../util"
import { hasSingleSignOnNodes, visibleAuthMethodGroups } from "../util/ui"

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

type FlowFormState =
  | FormStateSelectMethod
  | FormStateProvideIdentifier
  | FormStateMethodActive
  | { current: "success_screen" }
  | { current: "settings" }

type CommonFormStateProperties = {
  isSubmitting: boolean
  isReady: boolean
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
 *
 * In addition, it includes a common properties:
 * - `isSubmitting`: A boolean indicating whether the form is currently being submitted.
 * - `isReady`: A boolean indicating that no input group reported `form_input_loading` without a matching `form_input_ready`.
 */
export type FormState = FlowFormState & CommonFormStateProperties

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
       * and return to the screen the flow implies without an active method:
       * the method selection, or the identifier input of an identifier-first login.
       */
      type: "action_clear_active_method"
    }
  | {
      /**
       * Action to indicate that an input group is loading.
       * This action is dispatched when the specified input is in the process of loading,
       * and it sets the form state to not ready.
       */
      type: "form_input_loading"
      /**
       * The input group that is loading.
       */
      group: UiNodeGroupEnum
    }
  | {
      /**
       * Action to indicate that the input group is ready.
       * This action is dispatched when the specified input has finished loading,
       * and it sets the form state to ready.
       */
      type: "form_input_ready"
      /**
       * The input group that is ready.
       */
      input: UiNodeGroupEnum
    }
  | {
      /**
       * Action to indicate the start of a form submission.
       * This action is dispatched when the user submits the form, and it sets the submitting state to true.
       */
      type: "form_submit_start"
    }
  | {
      /**
       * Action to indicate the end of a form submission.
       * This action is dispatched when the form submission is complete, and it sets the submitting state to false.
       */
      type: "form_submit_end"
    }
  | {
      /**
       * Action to indicate that a page redirect is occurring.
       * This action is dispatched when the form submission results in a page redirect
       * (usually after a successful login, etc. to redirect to the main application's URL),
       * and it keeps the submitting state as true, as the next action is a full page unload.
       *
       * This is necessary, to keep submit buttons in a submitting state while the redirect is in progress,
       * to prevent the user accidentally interacting with the page while it's redirecting causing UX issues.
       */
      type: "page_redirect"
    }
  | {
      /**
       * Action to indicate that a page redirect will not necessarily unload the page.
       * This action is dispatched after a redirect to Apple's native Sign in with Apple sheet,
       * which leaves the page as it is when the user cancels the sheet. It ends the submission
       * that the page redirect kept in the submitting state.
       */
      type: "page_redirect_end"
    }

function findMethodWithMessage(nodes?: UiNode[]) {
  return nodes
    ?.filter((n) => !["default", "identifier_first"].includes(n.group))
    ?.find((node) => node.messages?.length > 0)
}

function isLinkingAccounts(flow: OryFlowContainer) {
  return flow.flow.ui.messages?.some((m) => m.id === 1010016)
}

function parseStateFromFlow(flow: OryFlowContainer): FlowFormState {
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
      } else if (isLinkingAccounts(flow)) {
        return { current: "select_method" }
      } else if (
        flow.flow.active &&
        !["default", "identifier_first"].includes(flow.flow.active)
      ) {
        return { current: "method_active", method: flow.flow.active }
      } else if (isChoosingMethod(flow)) {
        // Login has a special case where we only have one method. Here, we
        // do not want to display the chooser. Only methods the user can see
        // count: groups that consist of hidden nodes only (e.g. the passkey
        // conditional UI plumbing) are not selectable. SSO providers render
        // exclusively on the chooser screen, so their presence keeps it.
        const authMethods = visibleAuthMethodGroups(flow.flow.ui.nodes)
        if (
          authMethods.length === 1 &&
          !hasSingleSignOnNodes(flow.flow.ui.nodes) &&
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
  throw new Error(
    `[@ory/elements-react] Unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}. The flow is in a state this version of Ory Elements cannot render. Upgrade \`@ory/elements-react\`, and report the flow at https://github.com/ory/elements/issues if the error persists.`,
  )
}

function parseStateWithoutActiveMethod(flow: OryFlowContainer): FlowFormState {
  if (
    (flow.flowType === FlowType.Login ||
      flow.flowType === FlowType.Registration) &&
    !isChoosingMethod(flow) &&
    !isLinkingAccounts(flow)
  ) {
    return { current: "provide_identifier" }
  }
  return { current: "select_method" }
}

type FormLifecycle = {
  isSubmitting: boolean
  isRedirecting: boolean
  loadingInputs: readonly UiNodeGroupEnum[]
}

export type FormStateMachine = {
  flow: OryFlowContainer
  screen: FlowFormState
  selectedMethod?: UiNodeGroupEnum
  lifecycle: FormLifecycle
}

export function initFormStateMachine(flow: OryFlowContainer): FormStateMachine {
  return {
    flow,
    screen: parseStateFromFlow(flow),
    lifecycle: { isSubmitting: false, isRedirecting: false, loadingInputs: [] },
  }
}

function withLifecycle(
  state: FormStateMachine,
  lifecycle: Partial<FormLifecycle>,
): FormStateMachine {
  return { ...state, lifecycle: { ...state.lifecycle, ...lifecycle } }
}

export function formStateReducer(
  state: FormStateMachine,
  action: FormStateAction,
): FormStateMachine {
  switch (action.type) {
    case "action_flow_update":
      if (state.selectedMethod) {
        return {
          ...withLifecycle(state, { loadingInputs: [] }),
          flow: action.flow,
          screen: { current: "method_active", method: state.selectedMethod },
        }
      }
      return {
        ...state,
        flow: action.flow,
        screen: parseStateFromFlow(action.flow),
      }
    case "action_select_method":
      return {
        ...state,
        selectedMethod: action.method,
        screen: { current: "method_active", method: action.method },
      }
    case "action_clear_active_method":
      return {
        ...state,
        selectedMethod: undefined,
        screen: parseStateWithoutActiveMethod(state.flow),
      }
    case "form_input_loading":
      if (state.lifecycle.loadingInputs.includes(action.group)) {
        return state
      }
      return withLifecycle(state, {
        loadingInputs: [...state.lifecycle.loadingInputs, action.group],
      })
    case "form_input_ready":
      return withLifecycle(state, {
        loadingInputs: state.lifecycle.loadingInputs.filter(
          (group) => group !== action.input,
        ),
      })
    case "form_submit_start":
      return withLifecycle(state, { isSubmitting: true })
    case "form_submit_end":
      // A redirect unloads the page, so the form stays submitting until it does.
      return withLifecycle(state, {
        isSubmitting: state.lifecycle.isRedirecting,
      })
    case "page_redirect":
      return withLifecycle(state, { isSubmitting: true, isRedirecting: true })
    case "page_redirect_end":
      return withLifecycle(state, { isSubmitting: false, isRedirecting: false })
  }
  return state
}

function toFormState({ screen, lifecycle }: FormStateMachine): FormState {
  return {
    ...screen,
    isReady: lifecycle.loadingInputs.length === 0,
    isSubmitting: lifecycle.isSubmitting,
  }
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
export function useFormStateReducer(
  flow: OryFlowContainer,
): [FormState, Dispatch<FormStateAction>] {
  const [machine, dispatch] = useReducer(
    formStateReducer,
    flow,
    initFormStateMachine,
  )
  const formState = useMemo(() => toFormState(machine), [machine])
  return [formState, dispatch]
}
