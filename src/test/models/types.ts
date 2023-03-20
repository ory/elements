// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  GenericError,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiNodeGroupEnum,
  VerificationFlow,
} from "@ory/client"

export type Traits = {
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

export type ErrorBrowserLocationChangeRequired = {
  error: GenericError
  redirect_browser_to: string
}

export type MockFlowResponse = {
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
