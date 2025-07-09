// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export const registrationUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + "/self-service/registration/browser"

export const loginUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + "/self-service/login/browser"

export const settingsUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + "/self-service/settings/browser"

export const recoveryUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + "/self-service/recovery/browser"

export const verificationUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + "/self-service/verification/browser"
