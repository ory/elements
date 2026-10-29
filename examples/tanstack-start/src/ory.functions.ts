// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  getError,
  getLoginFlow,
  getLogoutFlow,
  getOryBaseUrl,
  getRecoveryFlow,
  getRegistrationFlow,
  getServerSession,
  getSettingsFlow,
  getVerificationFlow,
  validateOrySearch,
} from "@ory/tanstack-start"
import { createServerFn } from "@tanstack/react-start"
import config from "./ory.config"

export const oryBaseUrlFn = createServerFn({ method: "GET" }).handler(() =>
  getOryBaseUrl(),
)

export const loginFlowFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getLoginFlow(config, data))

export const registrationFlowFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getRegistrationFlow(config, data))

export const recoveryFlowFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getRecoveryFlow(config, data))

export const verificationFlowFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getVerificationFlow(config, data))

export const settingsFlowFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getSettingsFlow(config, data))

export const errorFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getError(data))

export const sessionFn = createServerFn({ method: "GET" }).handler(() =>
  getServerSession(),
)

export const logoutFlowFn = createServerFn({ method: "GET" }).handler(() =>
  getLogoutFlow(),
)
