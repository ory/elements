// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  GenericError,
  LoginFlow,
  RecoveryFlow,
  RecoveryFlowState,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiNodeGroupEnum,
  VerificationFlow,
  VerificationFlowState,
} from "@ory/client"

export type MockFlowStates =
  | "verification_choose_method"
  | "verification_sent_email"
  | "verification_passed_challenge"
  | "recovery_choose_method"
  | "recovery_sent_email"
  | "recovery_passed_challenge"
  | "session_forbidden"
  | "session_active"

export interface MockFlow {
  flow: string
  response?: MockFlowResponse
  state?: MockFlowStates
}

export const getFlowState = (
  a: MockFlowStates,
  flow: "verification" | "recovery",
): VerificationFlowState | RecoveryFlowState =>
  a.replace(flow + "_", "") as VerificationFlowState | RecoveryFlowState

export interface Traits {
  name?: string
  group: UiNodeGroupEnum
  value: string
  type:
    | "input"
    | "checkbox"
    | "button"
    | "hidden"
    | "submit"
    | "email"
    | "password"
  label: string
  required?: boolean
  node_type?: string
}

export interface ErrorBrowserLocationChangeRequired {
  error: GenericError
  redirect_browser_to: string
}

export interface MockFlowResponse {
  body:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | VerificationFlow
    | SettingsFlow
    | Session
    | GenericError
    | ErrorBrowserLocationChangeRequired
    | null
  status: number
  headers: Record<string, string>
}
