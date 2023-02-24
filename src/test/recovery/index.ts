import test, { expect } from "@playwright/test"
import { RecoveryPage } from "../models/RecoveryPage"
import { RandomString } from "../utils"

export const RecoveryMocks = {
  RecoverySuccessTest: async (recoveryPage: RecoveryPage) => {
    // Mock Ory Network service
    await recoveryPage.registerMockCreateResponse({})

    // Create a network intercept for the recovery response
    const createRequest = recoveryPage.interceptCreateResponse()

    await recoveryPage.goto()

    // Intercept the create response
    const createResponse = await createRequest
    await expect(createResponse.status()).toBe(200)

    // Validate that the form fields are present
    await recoveryPage.expectTraitFields()

    // Mock Ory Network service
    await recoveryPage.registerMockFetchResponse({})
    const fetchRequest = recoveryPage.interceptFetchResponse()

    // Reload the page to trigger the fetch request since the flow id should be in the url
    await recoveryPage.page.goto(
      new URL("?flow=" + RandomString(), recoveryPage.page.url()).href,
    )

    const fetchResponse = await fetchRequest
    await expect(fetchResponse.status()).toBe(200)

    await test.step("submit the recovery form with a valid email", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockSubmitResponse({})
      const submitRequest = recoveryPage.interceptSubmitResponse()

      await recoveryPage.submitForm()

      const submitResponse = await submitRequest
      await expect(submitResponse.status()).toBe(200)
    })

    await test.step("submit the recovery form again with a code", async () => {
      // Mock Ory Network service
      await recoveryPage.registerMockSubmitResponse({
        response: recoveryPage.getRecoveryFlowResponse("sent_email"),
      })
      const submitRequest = recoveryPage.interceptSubmitResponse()

      await recoveryPage.submitForm()

      const submitResponse = await submitRequest
      await expect(submitResponse.status()).toBe(200)
    })
  },
}
