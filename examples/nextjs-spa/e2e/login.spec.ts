// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginMocks, LoginPage, test } from "@ory/elements-test"

test.describe.parallel("Login Page", () => {
  test("login success", async ({ environment, page }) => {
    const { applicationUrl, oryProjectUrl } = environment
    const loginPage = new LoginPage(page, applicationUrl, oryProjectUrl)
    await LoginMocks.LoginSuccessTest(loginPage)
  })

  test("login with invalid credentials", async ({ environment, page }) => {
    const { applicationUrl, oryProjectUrl } = environment
    const loginPage = new LoginPage(page, applicationUrl, oryProjectUrl)
    await LoginMocks.LoginInvalidLoginCredentialsTest(loginPage)
  })
})
