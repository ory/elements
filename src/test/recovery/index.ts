// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import test, { expect } from "@playwright/test"
import { defaultRecoveryTraitsWithCode } from "../models"
import { RecoveryPage } from "../models/RecoveryPage"
import { UUIDv4 } from "../utils"

export const RecoveryMocks = {
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
        state: "recovery_submit_email",
      })
      const submitRequest = recoveryPage.interceptSubmitResponse()

      await recoveryPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(200)
    })

    await test.step("submit the recovery form again with a valid code", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockSubmitResponse({
        state: "recovery_submit_code",
      })
      const submitRequest = recoveryPage.interceptSubmitResponse()

      // check that the form fields expect a code input field
      await recoveryPage.expectTraitFields(defaultRecoveryTraitsWithCode)

      await recoveryPage.submitForm("[name='method'][type='submit']")

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(422)
      const submitResponseBody = await submitResponse.json()
      expect(submitResponseBody).toHaveProperty("redirect_browser_to")
    })
  },
}
