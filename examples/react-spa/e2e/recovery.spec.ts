import { RecoveryPage, test } from "@ory/elements-test"

test("recovery", async ({ environment, page }) => {
  const recoveryPage = new RecoveryPage(page, environment.applicationUrl)
  await recoveryPage.goto()

  await recoveryPage.expectTraitFields()
  await recoveryPage.submitForm()
})
