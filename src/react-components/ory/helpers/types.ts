// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client"

export type SelfServiceFlow =
  | LoginFlow
  | RecoveryFlow
  | RegistrationFlow
  | SettingsFlow
  | VerificationFlow
