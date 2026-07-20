// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

type Config = { sdk: { url: string } }

/**
 * Generates the login URL.
 */
export function loginUrl(config: Config): string {
  return `${config.sdk.url}/self-service/login/browser`
}

/**
 * Generates the registration URL.
 */
export function registrationUrl(config: Config): string {
  return `${config.sdk.url}/self-service/registration/browser`
}

/**
 * Generates the recovery URL.
 */
export function recoveryUrl(config: Config): string {
  return `${config.sdk.url}/self-service/recovery/browser`
}

/**
 * Generates the verification URL.
 */
export function verificationUrl(config: Config): string {
  return `${config.sdk.url}/self-service/verification/browser`
}

/**
 * Generates the settings URL.
 */
export function settingsUrl(config: Config): string {
  return `${config.sdk.url}/self-service/settings/browser`
}

/**
 * Generates the logout URL.
 */
export function logoutUrl(config: Config): string {
  return `${config.sdk.url}/self-service/logout/browser`
}
