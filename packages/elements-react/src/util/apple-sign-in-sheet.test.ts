// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { opensAppleSignInSheet } from "./apple-sign-in-sheet"

const appleAuthorizeUrl =
  "https://appleid.apple.com/auth/authorize?client_id=com.example&response_mode=form_post"

const userAgents = {
  iPhoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1",
  iPhoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1",
  iPadDesktopMode:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Safari/605.1.15",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  macFirefox:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0",
  macEdge:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.3537.71",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
}

const sheetBrowsers: [string, string, number][] = [
  ["Safari on iPhone", userAgents.iPhoneSafari, 5],
  ["Chrome on iPhone", userAgents.iPhoneChrome, 5],
  ["Safari on iPad in desktop mode", userAgents.iPadDesktopMode, 5],
  ["Safari on macOS", userAgents.macSafari, 0],
]

sheetBrowsers.forEach(([name, userAgent, maxTouchPoints]) => {
  test(`should expect the sheet for an Apple authorize URL in ${name}`, () => {
    expect(
      opensAppleSignInSheet(appleAuthorizeUrl, { userAgent, maxTouchPoints }),
    ).toBe(true)
  })
})

const otherBrowsers: [string, string, number][] = [
  ["Chrome on macOS", userAgents.macChrome, 0],
  ["Firefox on macOS", userAgents.macFirefox, 0],
  ["Edge on macOS", userAgents.macEdge, 0],
  ["Chrome on Android", userAgents.androidChrome, 5],
  ["Chrome on Windows", userAgents.windowsChrome, 0],
]

otherBrowsers.forEach(([name, userAgent, maxTouchPoints]) => {
  test(`should not expect the sheet for an Apple authorize URL in ${name}`, () => {
    expect(
      opensAppleSignInSheet(appleAuthorizeUrl, { userAgent, maxTouchPoints }),
    ).toBe(false)
  })
})

const otherUrls = [
  "https://accounts.google.com/o/oauth2/v2/auth?client_id=example",
  "https://appleid.apple.com/account/manage",
  "https://evil.example/appleid.apple.com/auth/authorize",
  "https://appleid.apple.com.evil.example/auth/authorize",
  "http://localhost:4455/ui/welcome",
  "/ui/welcome",
  "not a url",
]

otherUrls.forEach((url) => {
  test(`should not expect the sheet for ${url} in Safari on iPhone`, () => {
    expect(
      opensAppleSignInSheet(url, {
        userAgent: userAgents.iPhoneSafari,
        maxTouchPoints: 5,
      }),
    ).toBe(false)
  })
})
