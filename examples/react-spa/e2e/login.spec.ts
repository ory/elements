// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginPage, test } from "@ory/elements-test"
import { expect } from "@playwright/test"

test("login", async ({ environment, page }) => {
  const loginPage = new LoginPage(page, environment.applicationUrl)

  const createRequest = loginPage.interceptCreateRequest()
  await loginPage.goto()

  const createResponse = await createRequest

  await expect(createResponse.status).toBe(200)

  await loginPage.expectTraitFields()

  const fetchRequest = loginPage.interceptFetchRequest()
  await loginPage.page.reload()

  const fetchResponse = await fetchRequest
  await expect(fetchResponse.status).toBe(200)

  const submitRequest = loginPage.interceptSubmitRequest()
  await loginPage.submitForm()

  const submitResponse = await submitRequest
  await expect(submitResponse.status).toBe(200)
})
