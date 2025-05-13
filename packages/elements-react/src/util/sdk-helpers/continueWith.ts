// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  ContinueWithRecoveryUi,
  ContinueWithSetOrySessionToken,
  ContinueWithSettingsUi,
  ContinueWithVerificationUi,
  ContinueWithRedirectBrowserTo,
} from "../"

export type OnRedirectHandler = (url: string, external: boolean) => void

// The order in which the actions are defined here is the order in which they are expected to be executed.
const continueWithPriority = [
  "show_settings_ui",
  "show_recovery_ui",
  "show_verification_ui",
  "redirect_browser_to",
  "set_ory_session_token",
]

export function handleContinueWith(
  continueWith: ContinueWith[] | undefined,
  { onRedirect }: { onRedirect: OnRedirectHandler },
): boolean {
  if (!continueWith || continueWith.length === 0) {
    return false
  }

  const action = pickBestContinueWith(continueWith)
  if (!action) {
    return false
  }

  const redirectFlow = (id: string, flow: string, url?: string) => {
    if (url) {
      onRedirect(url, true)
      return true
    }

    onRedirect("/" + flow + "?flow=" + id, false)
    return true
  }

  if (isSetOrySessionToken(action)) {
    throw new Error("Ory Elements does not support API flows yet.")
  } else if (isRedirectBrowserTo(action) && action.redirect_browser_to) {
    // console.log("Redirecting to", action.redirect_browser_to)
    onRedirect(action.redirect_browser_to, true)
    return true
  } else if (isShowVerificationUi(action)) {
    return redirectFlow(action.flow.id, "verification", action.flow.url)
  } else if (isShowRecoveryUi(action)) {
    return redirectFlow(action.flow.id, "recovery", action.flow.url)
  } else if (isShowSettingsUi(action)) {
    // TODO: re-add url
    return redirectFlow(action.flow.id, "settings", action.flow.url)
  } else {
    throw new Error("Unknown action: " + JSON.stringify(action))
  }
}

/**
 * Picks the best continue with action from the list of continue with actions.
 *
 * @param continueWith - The list of continue with actions.
 */
export function pickBestContinueWith(continueWith: ContinueWith[]) {
  if (!continueWith || continueWith.length === 0) {
    return
  }

  const sorted = continueWith.sort(
    (a, b) =>
      continueWithPriority.indexOf(a.action) -
      continueWithPriority.indexOf(b.action),
  )
  return sorted[0]
}

/**
 * Checks if the continue with action is to set the Ory Session Token.
 *
 * @param continueWith - The continue with action.
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
 * @param continueWith - The continue with action.
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
 * @param continueWith - The continue with action.
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
 * @param continueWith - The continue with action.
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
 * @param continueWith - The continue with action.
 */
export function isShowVerificationUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithVerificationUi & {
  action: "show_verification_ui"
} {
  return continueWith.action === "show_verification_ui"
}
