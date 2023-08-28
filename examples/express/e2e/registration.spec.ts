// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RegistrationMocks, RegistrationPage, test } from "@ory/elements-test"

test.describe.parallel("Registration Page", () => {
  test("registration success", async ({ environment, page }) => {
    const { applicationUrl, oryProjectUrl } = environment

    const registrationPage = new RegistrationPage(
      page,
      applicationUrl,
      oryProjectUrl,
      {
        ssr: true
      }
    )

    await RegistrationMocks.RegistrationSuccessTest(registrationPage)
  })

  test("registration duplicate account", async ({ environment, page }) => {
    const { applicationUrl, oryProjectUrl } = environment

    const registrationPage = new RegistrationPage(
      page,
      applicationUrl,
      oryProjectUrl,
      {
        ssr: true
      }
    )

    await RegistrationMocks.RegistrationDuplicateAccountTest(registrationPage)
  })
})
