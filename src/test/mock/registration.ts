// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { registrationSubmitDuplicateAccountFixture } from "../fixtures"
import { RegistrationPage } from "../models"
import { UUIDv4 } from "../utils"
import { defaultMockFlowResponse } from "./utils"
import { expect, test } from "@playwright/test"

const setupRegistrationFlow = async (registrationPage: RegistrationPage) => {
  await test.step("mock the whoami response to be logged in", async () => {
    await registrationPage.registerMockWhoamiResponse({
      state: "session_forbidden",
    })
  })

  await test.step("mock the create registration response", async () => {
    // Mock the Ory Network service
    await registrationPage.registerMockCreateResponse({})
    await registrationPage.registerMockFetchResponse({})

    // Create a network intercept for the registration response
    const createRequest = registrationPage.interceptCreateResponse()
    const fetchRequest = registrationPage.interceptFetchResponse()

    // Navigate to the registration page
    // This should trigger the create request
    await registrationPage.goto()

    // Intercept the create response
    const createResponse = await createRequest
    expect(createResponse.status()).toBe(registrationPage.ssr ? 303 : 200)

    if (registrationPage.ssr) {
      // Intercept the fetch response
      const fetchResponse = await fetchRequest
      expect(fetchResponse.status()).toBe(200)
    }

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
  // RegistrationSuccessTest is a mock for a successful registration flow
  // it mocks the following requests:
  // - whoami response to be logged out
  // - create registration response
  // - fetch registration flow
  // - submit registration response
  // - whoami response to be logged in
  RegistrationSuccessTest: async (registrationPage: RegistrationPage) => {
    await setupRegistrationFlow(registrationPage)

    await test.step("mock the submit registration response", async () => {
      // Mock the Ory Network service
      await registrationPage.registerMockSubmitResponse({})
      await registrationPage.registerMockFetchResponse({})

      const fetchRequest = registrationPage.interceptFetchResponse()
      const submitRequest = registrationPage.interceptSubmitResponse()
      await registrationPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(registrationPage.ssr ? 303 : 200)

      if (registrationPage.ssr) {
        // Intercept the fetch response
        const fetchResponse = await fetchRequest
        expect(fetchResponse.status()).toBe(200)
      }
    })

    await test.step("mock the whoami response to be logged in", async () => {
      // register an active session
      await registrationPage.registerMockWhoamiResponse({
        state: "session_active",
      })
    })
  },
  // RegistrationDuplicateAccountTest is a mock for a registration flow with a duplicate account
  // it mocks the following requests:
  // - whoami response to be logged out
  // - create registration response
  // - fetch registration flow
  // - submit registration error response (duplicate account)
  RegistrationDuplicateAccountTest: async (
    registrationPage: RegistrationPage,
  ) => {
    await setupRegistrationFlow(registrationPage)

    await test.step("mock the submit registration response", async () => {
      // Mock the Ory Network service
      await registrationPage.registerMockSubmitResponse({
        response: {
          ...defaultMockFlowResponse,
          status: registrationPage.ssr ? 303 : 400,
          body: registrationSubmitDuplicateAccountFixture,
        },
      })
      await registrationPage.registerMockFetchResponse({
        response: {
          ...defaultMockFlowResponse,
          status: 200,
          body: registrationSubmitDuplicateAccountFixture,
        },
      })

      const fetchRequest = registrationPage.interceptFetchResponse()
      const submitRequest = registrationPage.interceptSubmitResponse()
      await registrationPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(registrationPage.ssr ? 303 : 400)

      if (registrationPage.ssr) {
        // Intercept the fetch response
        const fetchResponse = await fetchRequest
        expect(fetchResponse.status()).toBe(200)
      }

      await registrationPage.expectFlowMessage(
        "An account with the same identifier",
      )
    })
  },
}
