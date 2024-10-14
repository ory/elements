// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/experimental-ct-react"
import {
  AuthPage,
  loginFixture,
  loginRefreshFixture,
  loginTwoFactorFixture,
  recoveryFixture,
  registrationFixture,
  registrationCodeFixture,
  registrationCodeStepTwoFixture,
  verificationFixture,
  loginCodeFixture,
  loginFixtureOAuth2,
  loginConfirmWithTwoFactor,
} from "../../test"
import { UserAuthCard } from "./user-auth-card"
import { OAuth2LoginRequest, UiNodeInputAttributes } from "@ory/client"
import { isUiNodeInputAttributes } from "../../ui"

test("ory auth card login flow. signup disabled", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      title={"Sign in"}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/forgot",
        signupURL: undefined,
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

  await expect(component.locator('a[data-testid="signup-link"]')).toBeHidden()
  await expect(component).not.toContainText("Don't have an account", {
    ignoreCase: true,
  })
})

test("ory auth card login flow. signup enabled", async ({ mount }) => {
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

test("ory auth card registration code flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      title="Sign up"
      flowType="registration"
      additionalProps={{
        loginURL: "/login",
      }}
      flow={registrationCodeFixture}
    />,
  )

  const registrationComponent = new AuthPage(
    registrationCodeFixture.ui.nodes,
    component,
  )
  await registrationComponent.expectTraitFields()

  await expect(component).toContainText("Sign up", { ignoreCase: true })
  await expect(component).toContainText("Already have an account?", {
    ignoreCase: true,
  })
  await expect(component.locator('button[type="submit"]')).toHaveText(
    "Sign up with code",
  )
})

test("ory auth card registration step 2 of code flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      title="Sign up"
      flowType="registration"
      additionalProps={{
        loginURL: "/login",
      }}
      flow={registrationCodeStepTwoFixture}
    />,
  )

  const registrationComponent = new AuthPage(
    registrationCodeStepTwoFixture.ui.nodes,
    component,
  )
  await registrationComponent.expectTraitFields()

  await expect(component).toContainText("Sign up", { ignoreCase: true })
  await expect(component).toContainText("Already have an account?", {
    ignoreCase: true,
  })
  await expect(
    component.locator('button[type="submit"][name="method"]'),
  ).toHaveText("Submit")
  await expect(
    component.locator('button[type="submit"][name="resend"]'),
  ).toHaveText("Resend code")
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

  await expect(component).toContainText("Don't have an account?", {
    ignoreCase: true,
  })
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
      flow={loginTwoFactorFixture}
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

test("ory auth card login refresh flow", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      flow={loginRefreshFixture}
      flowType="login"
      title="Verify that's you"
      additionalProps={{ logoutURL: "/logout" }}
    />,
  )

  await expect(component).toContainText("You are using:")
  await expect(component).toContainText("johndoe@acme.com")
})

test("ory auth card link handler", async ({ mount }) => {
  let linkClicked = false

  const component = await mount(
    <UserAuthCard
      flow={loginRefreshFixture}
      flowType="login"
      title="Verify that's you"
      additionalProps={{
        logoutURL: { href: "/logout", handler: () => (linkClicked = true) },
      }}
    />,
  )

  await component.locator('a:text("Logout")').click()
  expect(linkClicked).toEqual(true)
})

test("ory auth card login with code", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      title="Sign In"
      flowType="login"
      additionalProps={{
        signupURL: "/signup",
      }}
      flow={loginCodeFixture}
    />,
  )

  const loginComponent = new AuthPage(loginCodeFixture.ui.nodes, component)
  await loginComponent.expectTraitFields()

  await expect(component).toContainText("Sign in", { ignoreCase: true })
  await expect(component).toContainText("Don't have an account?", {
    ignoreCase: true,
  })
  await expect(component.locator('button[type="submit"]')).toHaveText(
    "Sign in with code",
  )
})

test("ory auth card login should work without additionalProps", async ({
  mount,
}) => {
  const component = await mount(
    <UserAuthCard flowType="login" flow={loginCodeFixture} />,
  )

  const loginComponent = new AuthPage(loginCodeFixture.ui.nodes, component)
  await loginComponent.expectTraitFields()

  await expect(component).toContainText("Sign in", { ignoreCase: true })
  await expect(component).not.toContainText("Don't have an account?", {
    ignoreCase: true,
  })
})

test("ory auth card registration should work without additionalProps", async ({
  mount,
}) => {
  const component = await mount(
    <UserAuthCard flowType="registration" flow={registrationCodeFixture} />,
  )

  const registrationComponent = new AuthPage(
    registrationCodeFixture.ui.nodes,
    component,
  )
  await registrationComponent.expectTraitFields()

  await expect(component).toContainText("Sign up", { ignoreCase: true })
  await expect(component).not.toContainText("Already have an account?", {
    ignoreCase: true,
  })
})

test("ory auth card recovery should work without additionalProps", async ({
  mount,
}) => {
  const component = await mount(
    <UserAuthCard flowType="recovery" flow={recoveryFixture} />,
  )

  const recoveryComponent = new AuthPage(recoveryFixture.ui.nodes, component)
  await recoveryComponent.expectTraitFields()

  await expect(component).toContainText("Recover your account", {
    ignoreCase: true,
  })
  await expect(component).not.toContainText("Already have an account?", {
    ignoreCase: true,
  })
})

test("ory auth card verification should work without additionalProps", async ({
  mount,
}) => {
  const component = await mount(
    <UserAuthCard flowType="verification" flow={verificationFixture} />,
  )

  const verificationComponent = new AuthPage(
    verificationFixture.ui.nodes,
    component,
  )
  await verificationComponent.expectTraitFields()

  await expect(component).toContainText("Verify your account", {
    ignoreCase: true,
  })
  await expect(component).not.toContainText("Don't have an account?", {
    ignoreCase: true,
  })
})

test("ory auth card with oauth client", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard flowType="login" flow={loginFixtureOAuth2} />,
  )

  await expect(component).toContainText(
    "https://www.ory.sh/docs/ecosystem/sdks",
  )
})

test("ory auth card with oauh client name", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard
      flowType="login"
      flow={{
        ...loginFixtureOAuth2,
        oauth2_login_request: {
          ...(loginFixtureOAuth2.oauth2_login_request ??
            ({} as OAuth2LoginRequest)),
          client: {
            ...loginFixtureOAuth2.oauth2_login_request?.client,
            client_name: "a-real-client-name",
          },
        },
      }}
    />,
  )

  await expect(component).toContainText("a-real-client-name")
})

test("ory auth card login two factor confirmation", async ({ mount }) => {
  const component = await mount(
    <UserAuthCard flowType="login" flow={loginConfirmWithTwoFactor} />,
  )

  await expect(component).toContainText("Confirm it's you", {
    ignoreCase: true,
  })
  await expect(component).toHaveAttribute("data-testid", "login-auth-card")

  const identifier = loginConfirmWithTwoFactor.ui.nodes.find(
    ({ attributes }) =>
      isUiNodeInputAttributes(attributes) && attributes.name === "identifier",
  )?.attributes as UiNodeInputAttributes

  expect(identifier).not.toBeNull()
  expect(String(identifier.value)).toContain("@ory.sh")
  await expect(component).toContainText(`You are using:${identifier.value}`)
})
