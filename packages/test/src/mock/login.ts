// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/test"
import { loginSubmitIncorrectCredentialsFixture } from "../fixtures"
import { LoginPage } from "../models/LoginPage"
import { UUIDv4 } from "../utils"
import { defaultMockFlowResponse } from "./utils"

const setupLoginFlow = async (loginPage: LoginPage) => {
  await test.step("mock the whoami response to be logged out", async () => {
    await loginPage.registerMockWhoamiResponse({
      state: "session_forbidden",
    })
  })

  await test.step("mock the create login response", async () => {
    // mock the Ory Network service
    await loginPage.registerMockCreateResponse({})

    // create a network intercept for the login response
    const createRequest = loginPage.interceptCreateResponse()

    // navigate to the login page
    // this should trigger the create request
    await loginPage.goto()

    // intercept the create response
    const createResponse = await createRequest
    expect(createResponse.status()).toBe(200)

    // validate that the form fields are present
    await loginPage.expectTraitFields()
  })

  await test.step("mock the fetch login flow", async () => {
    // mock the Ory Network service
    await loginPage.registerMockFetchResponse({})

    const fetchRequest = loginPage.interceptFetchResponse()

    // reload the page to trigger the fetch request since the flow id should be in the url
    await loginPage.page.goto(
      new URL("?flow=" + UUIDv4(), loginPage.page.url()).href,
    )

    const fetchResponse = await fetchRequest
    expect(fetchResponse.status()).toBe(200)
  })
}

export const LoginMocks = {
  // LoginSuccessTest is a mock for a successful login flow
  // it mocks the following requests:
  // - whoami response to be logged out
  // - create login response
  // - fetch login flow
  // - submit login response
  // - whoami response to be logged in
  LoginSuccessTest: async (loginPage: LoginPage) => {
    await setupLoginFlow(loginPage)

    await test.step("mock the submit login response", async () => {
      // mock the Ory Network service
      await loginPage.registerMockSubmitResponse({})

      const submitRequest = loginPage.interceptSubmitResponse()
      await loginPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(200)
    })

    await test.step("mock the whoami response to be logged in", async () => {
      // register an active session
      await loginPage.registerMockWhoamiResponse({
        state: "session_active",
      })
    })
  },
  // LoginInvalidLoginCredentialsTest is a mock for a login flow with invalid credentials
  // it mocks the following requests:
  // - whoami response to be logged out
  // - create login response
  // - fetch login flow
  // - submit login flow with error response (invalid credentials)
  LoginInvalidLoginCredentialsTest: async (loginPage: LoginPage) => {
    await setupLoginFlow(loginPage)

    await test.step("mock the submit login response", async () => {
      // mock the Ory Network service
      await loginPage.registerMockSubmitResponse({
        response: {
          ...defaultMockFlowResponse,
          status: 400,
          body: loginSubmitIncorrectCredentialsFixture,
        },
      })

      const submitRequest = loginPage.interceptSubmitResponse()
      await loginPage.submitForm()

      const submitResponse = await submitRequest
      expect(submitResponse.status()).toBe(400)

      await loginPage.expectFlowMessage("provided credentials are invalid")
    })
  },
}
