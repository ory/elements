// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { test, VerificationMocks, VerificationPage } from "@ory/elements-test"

test.describe.parallel("Verification Page", () => {
  test("verification", async ({ environment, page }) => {
    const { applicationUrl, oryProjectUrl } = environment
    const verificationPage = new VerificationPage(
      page,
      applicationUrl,
      oryProjectUrl,
    )
    await VerificationMocks.VerificationSuccessTest(verificationPage)
  })
})
