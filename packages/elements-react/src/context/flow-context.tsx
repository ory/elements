// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react"
import { OryFlowContainer } from "../util/flowContainer"
import { FormState, FormStateAction, useFormStateReducer } from "./form-state"
import { UiText } from "@ory/client-fetch"

/**
 * Returns an object that contains the current flow and the flow type, as well as the configuration.
 *
 * @returns The current flow container
 */
export function useOryFlow() {
  const ctx = useContext(OryFlowContext)
  if (!ctx) {
    throw new Error("useOryFlow must be used within a OryFlowProvider")
  }

  return ctx
}

/**
 * Function to set the flow container.
 */
export type FlowContainerSetter = Dispatch<OryFlowContainer>

/**
 * The return value of the OryFlowContext.
 */
export type FlowContextValue = OryFlowContainer & {
  /**
   * Function to set the flow container.
   */
  setFlowContainer: FlowContainerSetter

  /**
   * The current form state.
   * @see FormState
   */
  formState: FormState

  /**
   * Current flow errors
   */
  errors: UiText[]

  /**
   * Function to set the current flow errors.
   */
  setErrors: (e: UiText[]) => void

  /**
   * Dispatch function to update the form state.
   */
  dispatchFormState: Dispatch<FormStateAction>
}

// This is fine, because we don't export the context itself and guard from it being null in useOryFlow
const OryFlowContext = createContext<FlowContextValue>(null!)

export type OryFlowProviderProps = PropsWithChildren<OryFlowContainer>

export function OryFlowProvider({
  children,
  ...container
}: OryFlowProviderProps) {
  const [flowContainer, setFlowContainer] = useState(container)
  const [formState, dispatchFormState] = useFormStateReducer(container)
  const [errors, setErrors] = useState<UiText[]>([])

  return (
    <OryFlowContext.Provider
      value={
        {
          ...flowContainer,
          setFlowContainer: (flowContainer) => {
            setFlowContainer(flowContainer)
            dispatchFormState({
              type: "action_flow_update",
              flow: flowContainer,
            })
          },
          errors,
          setErrors,
          formState,
          dispatchFormState,
        } as FlowContextValue
      }
    >
      {children}
    </OryFlowContext.Provider>
  )
}
