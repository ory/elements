// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { test, VerificationPage } from "@ory/elements-test"

test("verification", async ({ environment, page }) => {
  const verificationPage = new VerificationPage(
    page,
    environment.applicationUrl,
  )
  await verificationPage.goto()

  await verificationPage.expectTraitFields()
  await verificationPage.submitForm()
})
