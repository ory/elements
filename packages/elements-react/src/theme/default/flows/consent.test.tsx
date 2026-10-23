// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest, Session } from "@ory/client-fetch"
import { useOryConfiguration } from "@ory/elements-react"
import { render, screen } from "@testing-library/react"
import { defaultConfiguration } from "../../../tests/jest/test-utils"
import { Consent } from "./consent"

function SdkUrl() {
  return <span data-testid="sdk-url">{useOryConfiguration().sdk.url}</span>
}

test("should use the base URL attached to the consent request", () => {
  render(
    <Consent
      consentChallenge={Object.assign(
        {
          challenge: "challenge",
          requested_scope: ["openid"],
          client: { client_id: "client" },
        } as OAuth2ConsentRequest,
        { ory_base_url: "https://attached.example.com" },
      )}
      session={{ id: "session-id" } as Session}
      config={defaultConfiguration}
      csrfToken="csrf"
      formActionUrl="https://app.example.com/consent"
    >
      <SdkUrl />
    </Consent>,
  )

  expect(screen.getByTestId("sdk-url")).toHaveTextContent(
    "https://attached.example.com",
  )
})
