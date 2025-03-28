// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { translateConsentChallengeToUiNodes } from "../oauth2"

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
