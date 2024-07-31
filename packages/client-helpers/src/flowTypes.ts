// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowError,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"
import { OryClientConfiguration } from "./configuration"

export enum FlowType {
  Login = "login",
  Registration = "registration",
  Recovery = "recovery",
  Verification = "verification",
  Settings = "settings",
  Error = "error",
}

type BaseFlow<TFlowType, TFlow> = {
  flowType: TFlowType
  flow: TFlow
  config: OryClientConfiguration
}

export type LoginFlowContainer = BaseFlow<FlowType.Login, LoginFlow>
export type RegistrationFlowContainer = BaseFlow<
  FlowType.Registration,
  RegistrationFlow
>
export type RecoveryFlowContainer = BaseFlow<FlowType.Recovery, RecoveryFlow>
export type VerificationFlowContainer = BaseFlow<
  FlowType.Verification,
  VerificationFlow
>
export type SettingsFlowContainer = BaseFlow<FlowType.Settings, SettingsFlow>
export type ErrorFlowContainer = BaseFlow<FlowType.Error, FlowError>

export type FlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
// TODO: Add ErrorFlowContainer
