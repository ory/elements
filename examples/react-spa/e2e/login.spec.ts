// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginPage, test } from "@ory/elements-test"

test("login", async ({ environment, page }) => {
  const loginPage = new LoginPage(page, environment.applicationUrl)
  await loginPage.goto()

  await loginPage.expectTraitFields()
  await loginPage.submitForm()
})
