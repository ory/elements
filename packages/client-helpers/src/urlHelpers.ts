import { OryClientConfiguration } from "./configuration"

export const registrationUrl = (config: OryClientConfiguration) =>
  config.sdk.url + "/self-service/registration/browser"

export const loginUrl = (config: OryClientConfiguration) =>
  config.sdk.url + "/self-service/login/browser"

export const settingsUrl = (config: OryClientConfiguration) =>
  config.sdk.url + "/self-service/settings/browser"

export const recoveryUrl = (config: OryClientConfiguration) =>
  config.sdk.url + "/self-service/recovery/browser"

export const verificationUrl = (config: OryClientConfiguration) =>
  config.sdk.url + "/self-service/verification/browser"
