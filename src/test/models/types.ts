// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiNodeGroupEnum,
  VerificationFlow,
} from "@ory/client"

export type Traits = {
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

export type MockFlowResponse = {
  body:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | VerificationFlow
    | SettingsFlow
    | Session
  status: number
  headers: Record<string, string>
}
