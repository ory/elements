import { expect } from "@playwright/test"
import { RegistrationPage } from "../models"
import { RandomString } from "../utils"

export const RegistrationMocks = {
  RegistrationSuccessTest: async (registrationPage: RegistrationPage) => {
    await registrationPage.registerMockWhoamiResponse({
      state: "session_forbidden",
    })

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

    // Mock the Ory Network service
    await registrationPage.registerMockFetchResponse({})
    const fetchRequest = registrationPage.interceptFetchResponse()

    // Reload the page to trigger the fetch request since the flow id should be in the url
    await registrationPage.page.goto(
      new URL("?flow=" + RandomString(), registrationPage.page.url()).href,
    )

    const fetchResponse = await fetchRequest
    expect(fetchResponse.status()).toBe(200)

    // Mock the Ory Network service
    await registrationPage.registerMockSubmitResponse({})
    const submitRequest = registrationPage.interceptSubmitResponse()
    await registrationPage.submitForm()

    const submitResponse = await submitRequest
    expect(submitResponse.status()).toBe(200)

    // register an active session
    await registrationPage.registerMockWhoamiResponse({
      state: "session_active",
    })
  },
}
