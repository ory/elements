// Copyright © 2022 Ory Corp

import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
} from "@ory/client"

export type SelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRecoveryFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow
