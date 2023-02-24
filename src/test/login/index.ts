import { expect } from "@playwright/test"
import { LoginPage } from "../models/LoginPage"
import { RandomString } from "../utils"

export const LoginMocks = {
  LoginSuccessTest: async (loginPage: LoginPage) => {
    // mock the Ory Network service
    await loginPage.registerMockCreateResponse({})

    // create a network intercept for the login response
    const createRequest = loginPage.interceptCreateResponse()

    // navigate to the login page
    // this should trigger the create request
    await loginPage.goto()

    // intercept the create response
    const createResponse = await createRequest
    await expect(createResponse.status()).toBe(200)

    // validate that the form fields are present
    await loginPage.expectTraitFields()

    // mock the Ory Network service
    await loginPage.registerMockFetchResponse({})

    const fetchRequest = loginPage.interceptFetchResponse()

    // reload the page to trigger the fetch request since the flow id should be in the url
    await loginPage.page.goto(
      new URL("?flow=" + RandomString(), loginPage.page.url()).href,
    )

    const fetchResponse = await fetchRequest
    await expect(fetchResponse.status()).toBe(200)

    // mock the Ory Network service
    await loginPage.registerMockSubmitResponse({})

    const submitRequest = loginPage.interceptSubmitResponse()
    await loginPage.submitForm()

    const submitResponse = await submitRequest
    await expect(submitResponse.status()).toBe(200)
  },
  LoginErrorTest: async (loginPage: LoginPage) => {
    const createRequest = loginPage.interceptCreateResponse()

    await loginPage.goto()

    const createResponse = await createRequest

    await expect(createResponse.status()).toBe(200)

    await loginPage.expectTraitFields()

    const fetchRequest = loginPage.interceptFetchResponse()
    await loginPage.page.reload()

    const fetchResponse = await fetchRequest
    await expect(fetchResponse.status()).toBe(200)

    const submitRequest = loginPage.interceptSubmitResponse()
    await loginPage.submitForm()

    const submitResponse = await submitRequest
    await expect(submitResponse.status()).toBe(400)
  },
}
