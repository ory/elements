// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginMocks, LoginPage, test } from "@ory/elements-test"

test("login", async ({ environment, page }) => {
  const { applicationUrl, oryProjectUrl } = environment
  const loginPage = new LoginPage(page, applicationUrl, oryProjectUrl)
  await LoginMocks.LoginSuccessTest(loginPage)
})
