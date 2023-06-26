import { expect, test } from "@playwright/experimental-ct-react"
import {
  AuthPage,
  RandomString,
  registrationFixture,
  Traits,
} from "../../../test"
import { UpdateBody, UserAuthForm } from "./user-auth-form"
import { RegistrationSection } from "../sections/registration-section"

test("user auth form test", async ({ mount }) => {
  let body: UpdateBody | undefined
  const traits: Record<string, Traits> = {
    "traits.firstName": {
      group: "password",
      label: "First Name",
      value: RandomString(),
      type: "input",
    },
    "traits.email": {
      group: "password",
      label: "Email",
      value: RandomString() + "@example.com",
      type: "input",
    },
    password: {
      group: "password",
      label: "Password",
      value: RandomString(),
      type: "input",
    },
    csrf_token: {
      group: "default",
      label: "",
      value: RandomString(),
      type: "hidden",
    },
  }
  const component = await mount(
    <UserAuthForm
      flow={registrationFixture}
      onSubmit={({ body: b }) => {
        body = b
      }}
    >
      <RegistrationSection nodes={registrationFixture.ui.nodes} />
    </UserAuthForm>,
  )

  const registrationComponent = new AuthPage(traits, component)

  await registrationComponent.submitForm()

  expect(body).toBeTruthy()
  expect(body).toHaveProperty("method", "password")
  expect(body).toHaveProperty("password", traits.password.value)
  expect(body).toHaveProperty("traits", {
    email: traits["traits.email"].value,
    firstName: traits["traits.firstName"].value,
  })
})
