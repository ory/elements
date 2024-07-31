// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  ContinueWithRecoveryUi,
  ContinueWithRedirectBrowserTo,
  ContinueWithSetOrySessionToken,
  ContinueWithSettingsUi,
  ContinueWithVerificationUi,
} from "@ory/client-fetch"

// The order in which the actions are defined here is the order in which they are expected to be executed.
const order = [
  "show_settings_ui",
  "show_recovery_ui",
  "show_verification_ui",
  "redirect_browser_to",
  "set_ory_session_token",
]

/**
 * Picks the best continue with action from the list of continue with actions.
 *
 * @param continueWith
 */
export function pickBestContinueWith(continueWith: ContinueWith[]) {
  if (!continueWith || continueWith.length === 0) {
    return
  }

  const sorted = continueWith.sort(
    (a, b) => order.indexOf(a.action) - order.indexOf(b.action),
  )
  return sorted[0]
}

/**
 * Checks if the continue with action is to set the Ory Session Token.
 *
 * @param continueWith
 */
export function isSetOrySessionToken(
  continueWith: ContinueWith,
): continueWith is ContinueWithSetOrySessionToken & {
  action: "set_ory_session_token"
} {
  return continueWith.action === "set_ory_session_token"
}

/**
 * Checks if the continue with action is to redirect the browser to a different page.
 *
 * @param continueWith
 */
export function isRedirectBrowserTo(
  continueWith: ContinueWith,
): continueWith is ContinueWithRedirectBrowserTo & {
  action: "redirect_browser_to"
} {
  return continueWith.action === "redirect_browser_to"
}

/**
 * Checks if the continue with action is to show the recovery UI.
 *
 * @param continueWith
 */
export function isShowRecoveryUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithRecoveryUi & {
  action: "show_recovery_ui"
} {
  return continueWith.action === "show_recovery_ui"
}

/**
 * Checks if the continue with action is to show the settings UI.
 *
 * @param continueWith
 */
export function isShowSettingsUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithSettingsUi & {
  action: "show_settings_ui"
} {
  return continueWith.action === "show_settings_ui"
}

/**
 * Checks if the continue with action is to show the verification UI.
 *
 * @param continueWith
 */
export function isShowVerificationUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithVerificationUi & {
  action: "show_verification_ui"
} {
  return continueWith.action === "show_verification_ui"
}
