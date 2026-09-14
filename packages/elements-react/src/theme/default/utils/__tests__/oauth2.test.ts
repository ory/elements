// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isDeviceFlowConsentRequest,
  translateConsentChallengeToUiNodes,
} from "../oauth2"

describe("translate consent challenge to flow", () => {
  const testCases = {
    "no defined scope": { requested_scope: undefined },
    "empty scopes": { requested_scope: [] },
    "default scopes": { requested_scope: ["openid", "offline_access"] },
    "custom scopes": { requested_scope: ["custom_scope", "foo:bar"] },
  }

  const mockDate = new Date("2025-03-24T12:00:00Z")
  jest
    .spyOn(global, "Date")
    .mockImplementation(() => mockDate as unknown as Date)

  for (const [tc, { requested_scope }] of Object.entries(testCases)) {
    test(`- ${tc}`, () => {
      const consentFlow = translateConsentChallengeToUiNodes(
        { challenge: "consent-challenge", requested_scope },
        "csrfToken",
        "/foo/bar/oauth",
        { id: "session-id" },
      )
      expect(consentFlow).toMatchSnapshot()
    })
  }
})

describe("device flow consent request", () => {
  const testCases: Record<string, { request_url?: string; expected: boolean }> =
    {
      "device verification endpoint": {
        request_url: "https://ory.example.com/oauth2/device/verify",
        expected: true,
      },
      // Hydra adds client_id to the flow's request_url while accepting the
      // user code, so the stored URL is never bare.
      "device verification endpoint with a query": {
        request_url:
          "https://ory.example.com/oauth2/device/verify?client_id=abcd",
        expected: true,
      },
      "device verification endpoint behind a path prefix": {
        request_url: "https://ory.example.com/ory/oauth2/device/verify",
        expected: true,
      },
      "authorization endpoint": {
        request_url:
          "https://ory.example.com/oauth2/auth?client_id=abcd&response_type=code",
        expected: false,
      },
      "verification path in the query only": {
        request_url:
          "https://ory.example.com/oauth2/auth?redirect_uri=https://ory.example.com/oauth2/device/verify",
        expected: false,
      },
      "verification path in the fragment only": {
        request_url:
          "https://ory.example.com/oauth2/auth#/oauth2/device/verify",
        expected: false,
      },
      "relative URL": { request_url: "/oauth2/device/verify", expected: true },
      "empty URL": { request_url: "", expected: false },
      "missing URL": { expected: false },
    }

  for (const [tc, { request_url, expected }] of Object.entries(testCases)) {
    test(`- ${tc}`, () => {
      expect(
        isDeviceFlowConsentRequest({
          challenge: "consent-challenge",
          request_url,
        }),
      ).toBe(expected)
    })
  }
})
