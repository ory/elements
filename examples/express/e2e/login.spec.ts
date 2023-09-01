// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { LoginMocks, LoginPage, test as base, UUIDv4 } from "@ory/elements-test"

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page, environment }, use) => {
    const { applicationUrl, oryProjectUrl } = environment
    const loginPage = new LoginPage(page, applicationUrl, oryProjectUrl, {
      ssr: true,
    })
    await use(loginPage)
  },
})

test.describe.parallel("Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    loginPage.server?.listen()
  })
  test.afterEach(async ({ loginPage }) => {
    loginPage.server?.close()
  })

  test.only("login success", async ({ loginPage }) => {
    // we need to register a mock redirect
    // for the express application to work
    await loginPage.page.route("**/login", async (route) => {
      await route.fulfill({
        status: 303,
        headers: {
          Location: loginPage.pageUrl + "?flow=" + UUIDv4(),
        },
      })
    })
    await LoginMocks.LoginSuccessTest(loginPage)
  })

  test("login with invalid credentials", async ({ loginPage }) => {
    await LoginMocks.LoginInvalidLoginCredentialsTest(loginPage)
  })
})
