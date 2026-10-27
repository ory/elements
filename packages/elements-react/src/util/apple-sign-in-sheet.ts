// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Whether navigating to `url` likely opens Apple's native Sign in with Apple
 * sheet instead of Apple's web page.
 *
 * Every browser on iOS and iPadOS, and Safari on macOS, hand Apple's authorize
 * endpoint to the sheet. Canceling the sheet drops the navigation without
 * unloading the page or firing any event on it.
 *
 * @param url - The URL the browser is about to navigate to.
 * @param browser - The navigator to inspect, usually `window.navigator`.
 */
export function opensAppleSignInSheet(
  url: string,
  browser: Pick<Navigator, "userAgent" | "maxTouchPoints">,
): boolean {
  let target: URL
  try {
    target = new URL(url)
  } catch {
    return false
  }
  if (
    target.hostname !== "appleid.apple.com" ||
    target.pathname !== "/auth/authorize"
  ) {
    return false
  }

  const { userAgent } = browser
  if (/\b(iPhone|iPad|iPod)\b/.test(userAgent)) {
    return true
  }
  if (!userAgent.includes("Macintosh")) {
    return false
  }
  // iPadOS requests desktop sites with a macOS user agent.
  if ((browser.maxTouchPoints ?? 0) > 1) {
    return true
  }
  return /\bVersion\/[\d.]+.*\bSafari\//.test(userAgent)
}
