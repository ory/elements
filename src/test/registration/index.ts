// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import test, { expect } from "@playwright/test"
import { registrationSubmitDuplicateAccountFixture } from "../fixtures"
import { defaultMockFlowResponse, RegistrationPage } from "../models"
import { UUIDv4 } from "../utils"

const setupRegistrationFlow = async (registrationPage: RegistrationPage) => {
  await test.step("mock the whoami response to be logged in", async () => {
    await registrationPage.registerMockWhoamiResponse({
      state: "session_forbidden",
    })
  })

  await test.step("mock the create registration response", async () => {
    // Mock the Ory Network service
    await registrationPage.registerMockCreateResponse({})

    // Create a network intercept for the registration response
    const createRequest = registrationPage.interceptCreateResponse()

    // Navigate to the registration page
    // This should trigger the create request
    await registrationPage.goto()

    // Intercept the create response
    const createResponse = await createRequest
    expect(createResponse.status()).toBe(200)

    // Validate that the form fields are present
    await registrationPage.expectTraitFields()
  })

  await test.step("mock the fetch registration flow", async () => {
    // Mock the Ory Network service
    await registrationPage.registerMockFetchResponse({})
    const fetchRequest = registrationPage.interceptFetchResponse()

    // Reload the page to trigger the fetch request since the flow id should be in the url
    await registrationPage.page.goto(
      new URL("?flow=" + UUIDv4(), registrationPage.page.url()).href,
    )

    const fetchResponse = await fetchRequest
    expect(fetchResponse.status()).toBe(200)
  })
}

export const RegistrationMocks = {
  RegistrationSuccessTest: async (registrationPage: RegistrationPage) => {
    await setupRegistrationFlow(registrationPage)

    await test.step("mock the submit registration response", async () => {
      // Mock the Ory Network service
      await registrationPage.registerMockSubmitResponse({})
      const submitRequest = registrationPage.interceptSubmitResponse()
      await registrationPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(200)
    })

    await test.step("mock the whoami response to be logged in", async () => {
      // register an active session
      await registrationPage.registerMockWhoamiResponse({
        state: "session_active",
      })
    })
  },
  RegistrationDuplicateAccountTest: async (
    registrationPage: RegistrationPage,
  ) => {
    await setupRegistrationFlow(registrationPage)

    await test.step("mock the submit registration response", async () => {
      // Mock the Ory Network service
      await registrationPage.registerMockSubmitResponse({
        response: {
          ...defaultMockFlowResponse,
          status: 400,
          body: registrationSubmitDuplicateAccountFixture,
        },
      })

      const submitRequest = registrationPage.interceptSubmitResponse()
      await registrationPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(400)

      await registrationPage.expectErorr("An account with the same identifier")
    })
  },
}
