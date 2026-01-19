// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowError,
  FlowType,
  LoginFlow,
  OAuth2ConsentRequest,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiContainer,
  VerificationFlow,
} from "@ory/client-fetch"

/**
 * A flow container for the LoginFlow
 */
export type LoginFlowContainer = {
  flowType: FlowType.Login
  flow: LoginFlow
}

/**
 * A flow container for the RegistrationFlow
 */
export type RegistrationFlowContainer = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
}

/**
 * A flow container for the RecoveryFlow
 */
export type RecoveryFlowContainer = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
}

/**
 * A flow container for the VerificationFlow
 */
export type VerificationFlowContainer = {
  flowType: FlowType.Verification
  flow: VerificationFlow
}

/**
 * A flow container for the SettingsFlow
 */
export type SettingsFlowContainer = {
  flowType: FlowType.Settings
  flow: SettingsFlow
}

/**
 * A flow container for the FlowError
 */
export type ErrorFlowContainer = {
  flowType: FlowType.Error
  flow: FlowError
}

/**
 * A flow container for the OAuth2 consent flow
 */
export type ConsentFlow = {
  created_at: Date
  expires_at: Date
  id: "UNSET"
  issued_at: Date
  state: "show_form" | "rejected" | "accepted"
  active: "oauth2_consent"
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}

/**
 * A flow container for the OAuth2 ConsentFlow
 */
export type ConsentFlowContainer = {
  flowType: FlowType.OAuth2Consent
  flow: ConsentFlow
}

/**
 * A union type of all flow containers
 */
export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | ConsentFlowContainer

/**
 * Type guard to check if a flow is a ConsentFlow
 */
export function isConsentFlow(
  flow: OryFlowContainer["flow"],
): flow is ConsentFlow {
  return (
    flow &&
    "consent_request" in flow &&
    "session" in flow &&
    "active" in flow &&
    flow.active === "oauth2_consent"
  )
}
