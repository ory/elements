import {
  AuthPage,
  loginFixture,
  recoveryFixture,
  registrationFixture,
  twoFactorLoginFixture,
  verificationFixture,
} from "@ory/elements-test"
import { expect, test } from "@playwright/experimental-ct-react"
import { UserAuthCard } from "./user-auth-card"

test("ory auth card login flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      title={"Sign in"}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/forgot",
        signupURL: "/signup",
      }}
      flow={loginFixture}
    />,
  )

  const loginComponent = new AuthPage(loginFixture.ui.nodes, component)
  await loginComponent.expectTraitFields()
  await loginComponent.expectTraitLabels()

  await expect(component).toContainText("Sign in")
  await expect(component).toContainText("Forgot password?", {
    ignoreCase: true,
  })
  await expect(
    component.locator('a[data-testid="forgot-password-link"]'),
  ).toHaveAttribute("href", "/forgot")
  await expect(
    component.locator('a[data-testid="signup-link"]'),
  ).toHaveAttribute("href", "/signup")
  await expect(component).toContainText("Don't have an account", {
    ignoreCase: true,
  })
})

test("ory auth card registration flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      title="Sign up"
      flowType="registration"
      additionalProps={{
        loginURL: "/login",
      }}
      flow={registrationFixture}
    />,
  )

  const registrationComponent = new AuthPage(
    registrationFixture.ui.nodes,
    component,
  )

  await registrationComponent.expectTraitFields()
  await registrationComponent.expectTraitFields()

  await expect(component).toContainText("Sign up", { ignoreCase: true })
  await expect(component).toContainText("Already have an account?", {
    ignoreCase: true,
  })
  await expect(component.locator('a[data-testid="cta-link"]')).toHaveAttribute(
    "href",
    "/login",
  )

  const submit = component.locator('button[type="submit"]')
  await expect(submit).toBeVisible()
  await expect(submit).toHaveText("Sign up")
})

test("ory auth card verification flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      flow={verificationFixture}
      flowType={"verification"}
      additionalProps={{
        signupURL: "/signup",
      }}
      title={"Verification"}
    />,
  )

  const verificationComponent = new AuthPage(
    verificationFixture.ui.nodes,
    component,
  )
  await verificationComponent.expectTraitFields()
  await verificationComponent.expectTraitLabels()

  await expect(component).toContainText("Verification")
  await expect(component.locator('a[href="/signup"]')).toBeVisible()
})

test("ory auth card recovery flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      flow={recoveryFixture}
      flowType={"recovery"}
      additionalProps={{
        loginURL: "/login",
      }}
      title={"Recovery"}
    />,
  )

  const recoveryComponent = new AuthPage(recoveryFixture.ui.nodes, component)
  await recoveryComponent.expectTraitFields()
  await recoveryComponent.expectTraitLabels()

  await expect(component).toContainText("Recovery")
  await expect(component.locator('a[href="/login"]')).toBeVisible()
})

test("ory auth card login 2fa flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      flow={twoFactorLoginFixture}
      flowType={"login"}
      additionalProps={{
        logoutURL: "/logout",
      }}
      title={"Two-factor authentication"}
    />,
  )

  await expect(component).toContainText("Two-factor authentication")
  await expect(component.locator('a[href="/logout"]')).toBeVisible()

  await expect(
    component.locator('button[name="webauthn_login_trigger"]'),
  ).toBeVisible()
})
