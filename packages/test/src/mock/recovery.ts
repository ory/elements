// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/test"
import { RecoveryPage } from "../models/RecoveryPage"
import { defaultRecoveryTraitsWithCode } from "../traits"
import { UUIDv4 } from "../utils"
import { ErrorBrowserLocationChangeRequired } from "@ory/client"

export const RecoveryMocks = {
  // RecoverySuccessTest is a mock for a successful recovery `code` flow
  // it mocks the following requests:
  // - whoami response to be logged out
  // - create recovery response
  // - fetch recovery flow
  // - submit email recovery response
  // - submit code reocvery response
  // - whoami response to be logged in
  RecoverySuccessTest: async (recoveryPage: RecoveryPage) => {
    await test.step("mock the whoami response to be logged in", async () => {
      await recoveryPage.registerMockWhoamiResponse({
        state: "session_forbidden",
      })
    })

    await test.step("mock the create recovery response", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockCreateResponse({})

      // Create a network intercept for the recovery response
      const createRequest = recoveryPage.interceptCreateResponse()
      await recoveryPage.goto()

      // Intercept the create response
      const createResponse = await createRequest
      expect(createResponse.status()).toBe(200)

      await expect(recoveryPage.page).toHaveScreenshot()
      // Validate that the form fields are present
      await recoveryPage.expectTraitFields()
    })

    await test.step("mock the fetch recovery flow", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockFetchResponse({})
      const fetchRequest = recoveryPage.interceptFetchResponse()

      // Reload the page to trigger the fetch request since the flow id should be in the url
      await recoveryPage.page.goto(
        new URL("?flow=" + UUIDv4(), recoveryPage.page.url()).href,
      )

      const fetchResponse = await fetchRequest
      expect(fetchResponse.status()).toBe(200)
    })

    await test.step("submit the recovery form with a valid email", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockSubmitResponse({
        state: "recovery_sent_email",
      })
      const submitRequest = recoveryPage.interceptSubmitResponse()

      await recoveryPage.locator
        .locator("input[name='email']")
        .fill(recoveryPage.traits.email.value)
      await recoveryPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(200)

      await expect(recoveryPage.page).toHaveScreenshot()
    })

    await test.step("submit the recovery form again with a valid code", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockSubmitResponse({
        state: "recovery_passed_challenge",
      })
      await recoveryPage.registerMockWhoamiResponse({
        state: "session_active",
      })

      const submitRequest = recoveryPage.interceptSubmitResponse()

      // check that the form fields expect a code input field
      await recoveryPage.expectTraitFields(defaultRecoveryTraitsWithCode)

      await recoveryPage.locator
        .locator("input[name='code']")
        .fill(defaultRecoveryTraitsWithCode.code.value)
      await recoveryPage.submitForm("[name='method'][type='submit']")

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(422)
      const submitResponseBody =
        (await submitResponse.json()) as ErrorBrowserLocationChangeRequired
      expect(submitResponseBody).toHaveProperty("redirect_browser_to")
    })
  },
}
