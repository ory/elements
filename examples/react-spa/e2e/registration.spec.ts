// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RegistrationMocks, RegistrationPage, test } from "@ory/elements-test"

test("registration", async ({ environment, page }) => {
  const { applicationUrl, oryProjectUrl } = environment

  const registrationPage = new RegistrationPage(
    page,
    applicationUrl,
    oryProjectUrl,
  )

  await RegistrationMocks.RegistrationSuccessTest(registrationPage)
})
