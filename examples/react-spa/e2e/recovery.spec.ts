// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryMocks, RecoveryPage, test } from "@ory/elements-test"

test("recovery", async ({ environment, page }) => {
  const { applicationUrl, oryProjectUrl } = environment
  const recoveryPage = new RecoveryPage(page, applicationUrl, oryProjectUrl)

  await RecoveryMocks.RecoverySuccessTest(recoveryPage)
})
