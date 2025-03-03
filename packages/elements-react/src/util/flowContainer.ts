// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowError,
  FlowType,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiContainer,
  VerificationFlow,
} from "@ory/client-fetch"
import { OryClientConfiguration } from "./clientConfiguration"

/**
 * A generic flow container, containing a flowType, the flow itself and the config object
 *
 * @see OryClientConfiguration
 */
type OryFlow<TFlowType extends FlowType, TFlow> = {
  flowType: TFlowType
  flow: TFlow
  config: OryClientConfiguration
}

/**
 * A flow container for the login flow
 *
 * @see OryFlow
 * @see LoginFlow
 */
export type LoginFlowContainer = OryFlow<FlowType.Login, LoginFlow>

/**
 * A flow container for the registration flow
 *
 * @see OryFlow
 * @see RegistrationFlow
 */
export type RegistrationFlowContainer = OryFlow<
  FlowType.Registration,
  RegistrationFlow
>

/**
 * A flow container for the recovery flow
 *
 * @see OryFlow
 * @see RecoveryFlow
 */
export type RecoveryFlowContainer = OryFlow<FlowType.Recovery, RecoveryFlow>

/**
 * A flow container for the verification flow
 *
 * @see OryFlow
 * @see VerificationFlow
 *
 */
export type VerificationFlowContainer = OryFlow<
  FlowType.Verification,
  VerificationFlow
>
/**
 * A flow container for the settings flow
 *
 * @see OryFlow
 * @see SettingsFlow
 */
export type SettingsFlowContainer = OryFlow<FlowType.Settings, SettingsFlow>

/**
 * A flow container for the error flow
 *
 * @see OryFlow
 * @see FlowError (Error flow)
 *
 */
export type ErrorFlowContainer = OryFlow<FlowType.Error, FlowError>

export type ConsentFlow = {
  created_at: Date
  expires_at: Date
  id: string
  issued_at: Date
  state: "show_form" | "rejected" | "accepted"
  ui: UiContainer
}

export type ConsentFlowContainer = OryFlow<FlowType.Consent, ConsentFlow>

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
