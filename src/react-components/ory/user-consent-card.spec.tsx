// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest } from "@ory/client"
import { expect, test } from "@playwright/experimental-ct-react"
import { ConsentPage } from "../../test/models/ConsentPage"
import { UserConsentCard } from "./user-consent-card"

test("ory consent card login flow", async ({ mount }) => {
  const defaults = {
    csrfToken: "csrfToken_example",
    action: "consent",
    client_name: "Best App",
    client: {
      tos_uri: "https://test_tos_uri/",
      policy_uri: "https://test_policy_uri/",
    },
    consent: {} as OAuth2ConsentRequest,
    requested_scope: ["test_scope1", "test_scope2", "test_scope3"],
  }

  const component = await mount(<UserConsentCard {...defaults} />)

  await expect(component).toBeVisible()
  const consentComponent = new ConsentPage(component)

  await consentComponent.expectScopeFields(defaults.requested_scope)
  await consentComponent.expectUris([
    "https://test_tos_uri/",
    "https://test_policy_uri/",
  ])
  await consentComponent.expectAllowSubmit()
})
