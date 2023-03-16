import test, { expect } from "@playwright/test"
import { VerificationPage } from "../models"
import { RandomString } from "../utils"

export const VerificationMocks = {
  VerificationSuccessTest: async (verificationPage: VerificationPage) => {
    await test.step("mock the whoami response to be logged in", async () => {
      await verificationPage.registerMockWhoamiResponse({
        state: "session_active",
      })
    })

    await test.step("mock the create verification response", async () => {
      // Mock the Ory Network service
      await verificationPage.registerMockCreateResponse({})

      // Create a network intercept for the registration response
      const createRequest = verificationPage.interceptCreateResponse()

      // Navigate to the registration page
      // This should trigger the create request
      await verificationPage.goto()
      // Intercept the create response
      const createResponse = await createRequest
      expect(createResponse.status()).toBe(200)
      // Validate that the form fields are present
      await verificationPage.expectTraitFields()
    })

    await test.step("mock the fetch verification response", async () => {
      // Mock the Ory Network service
      await verificationPage.registerMockFetchResponse({})
      const fetchRequest = verificationPage.interceptFetchResponse()

      // Reload the page to trigger the fetch request since the flow id should be in the url
      await verificationPage.page.goto(
        new URL("?flow=" + RandomString(), verificationPage.page.url()).href,
      )

      const fetchResponse = await fetchRequest
      expect(fetchResponse.status()).toBe(200)
    })

    await test.step("mock the submit email verification response", async () => {
      // mock the Ory Network service
      await verificationPage.registerMockSubmitResponse({
        state: "verification_submit_email",
      })

      const submitRequest = verificationPage.interceptSubmitResponse()
      await verificationPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(200)

      // Validate that the form fields are present
      await verificationPage.expectTraitFields({
        code: {
          group: "code",
          label: "Enter verification code",
          type: "input",
          value: "",
          node_type: "input",
          required: true,
        },
      })
    })
  },
}
