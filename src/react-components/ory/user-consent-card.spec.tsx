import { OAuth2ConsentRequest } from "@ory/client"
import { expect, test } from "@playwright/experimental-ct-react"
import { ConsentPage } from "../../test/models/ConsentPage"
import { CustomOnSubmitCallback } from "./helpers/common"
import {
  ConsentFormPayload,
  UserConsentCard,
  UserConsentCardProps,
} from "./user-consent-card"

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

test("ory consent card login flow with custom onSubmit", async ({ mount }) => {
  let submitBody: unknown

  const submit: CustomOnSubmitCallback<ConsentFormPayload> = ({ body }) => {
    submitBody = body
  }

  const defaults: UserConsentCardProps = {
    csrfToken: "csrfToken_example",
    action: "/consent",
    client_name: "Best App",
    client: {
      tos_uri: "https://test_tos_uri/",
      policy_uri: "https://test_policy_uri/",
    },
    consent: {} as OAuth2ConsentRequest,
    requested_scope: ["test_scope1", "test_scope2", "test_scope3"],
    onSubmit: submit,
  }

  const component = await mount(<UserConsentCard {...defaults} />)
  const consentComponent = new ConsentPage(component)

  await consentComponent.expectScopeFields(defaults.requested_scope as string[])
  await consentComponent.expectUris([
    "https://test_tos_uri/",
    "https://test_policy_uri/",
  ])
  await consentComponent.expectAllowSubmit()
  await consentComponent.locator
    .locator('input[type="checkbox"]')
    .all()
    .then(async (elements) => {
      for (const e of elements) {
        await e.check()
      }
    })

  await consentComponent.submitForm(
    "button[name='consent_action'][value=accept]",
  )

  expect(submitBody).toBeTruthy()
  expect(submitBody).toEqual({
    remember: "1",
    consent_challenge: "",
    consent_action: "accept",
    _csrf: defaults.csrfToken,
    grant_scope: defaults.requested_scope,
  })
})
