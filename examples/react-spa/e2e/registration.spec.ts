import { RegistrationPage, test } from "@ory/elements-test"

test("registration", async ({ environment, page }) => {
  const registrationPage = new RegistrationPage(
    page,
    environment.applicationUrl,
  )
  await registrationPage.goto()

  await registrationPage.expectTraitFields()
  await registrationPage.submitForm()
})
