// Copyright © 2024 Ory Corp
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
 * A flow container for the {@link LoginFlow}
 * @interface
 */
export type LoginFlowContainer = {
  flowType: FlowType.Login
  flow: LoginFlow
}

/**
 * A flow container for the {@link RegistrationFlow}
 * @interface
 */
export type RegistrationFlowContainer = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
}

/**
 * A flow container for the {@link RecoveryFlow}
 * @interface
 */
export type RecoveryFlowContainer = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
}

/**
 * A flow container for the {@link VerificationFlow}
 * @interface
 */
export type VerificationFlowContainer = {
  flowType: FlowType.Verification
  flow: VerificationFlow
}
/**
 * A flow container for the {@link SettingsFlow}
 * @interface
 */
export type SettingsFlowContainer = {
  flowType: FlowType.Settings
  flow: SettingsFlow
}

/**
 * A flow container for the {@link FlowError}
 * @interface
 */
export type ErrorFlowContainer = { flowType: FlowType.Error; flow: FlowError }

/**
 * A flow container for the OAuth2 consent flow
 *
 * Note: This is a polyfill for the OAuth2 consent flow, which is not yet implemented in the Ory SDK.
 * It tries to mirror the structure of the other flow containers as closely as possible.
 * @interface
 */
export type ConsentFlow = {
  /**
   * When the flow was created.
   */
  created_at: Date
  /**
   * When the flow expires.
   */
  expires_at: Date
  /**
   * Always "UNSET" as the consent flow does not have a specific ID.
   */
  id: "UNSET"
  /**
   * When the flow was issued.
   */
  issued_at: Date
  /**
   * The state of the consent flow.
   *
   * - "show_form": The form is being shown to the user.
   * - "rejected": The user has rejected the consent request.
   * - "accepted": The user has accepted the consent request.
   */
  state: "show_form" | "rejected" | "accepted"
  /**
   * The active part of the flow, which is always "oauth2_consent" for this flow.
   */
  active: "oauth2_consent"
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}

/**
 * A flow container for the OAuth2 {@link ConsentFlow}
 * @interface
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
// TODO: Add ErrorFlowContainer
