import React from "react"
import { expect, test } from "@playwright/experimental-ct-react"
import { SelfServiceAuthCard } from "./self-service-auth-card"

test("ory auth card login flow", async ({ mount }) => {
  const component = await mount(
    <SelfServiceAuthCard
      title={"Sign in"}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/forgot",
        signupURL: "/signup",
      }}
      flow={{
        id: "",
        state: "choose_method",
        type: "browser",
        ui: {
          action: "",
          method: "POST",
          nodes: [
            {
              group: "default",
              attributes: {
                name: "id",
                type: "text",
                node_type: "input",
                disabled: false,
              },
              messages: [],
              type: "input",
              meta: {},
            },
          ],
        },
      }}
    />,
  )
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

  await expect(component.locator('input[name="id"]')).toBeVisible()
})

test("ory auth card registration flow", async ({ mount }) => {
  const component = await mount(
    <SelfServiceAuthCard
      title="Sign up"
      flowType="registration"
      additionalProps={{
        loginURL: "/login",
      }}
      flow={{
        id: "",
        state: "choose_method",
        type: "browser",
        ui: {
          action: "",
          method: "POST",
          nodes: [
            {
              group: "default",
              attributes: {
                name: "id",
                type: "text",
                node_type: "input",
                disabled: false,
              },
              messages: [],
              type: "input",
              meta: {},
            },
          ],
        },
      }}
    />,
  )

  await expect(component).toContainText("Sign up", { ignoreCase: true })
  await expect(component).toContainText("Already have an account?", {
    ignoreCase: true,
  })
  await expect(
    component.locator('a[data-testid="login-link"]'),
  ).toHaveAttribute("href", "/login")
  await expect(component.locator('input[name="id"]')).toBeVisible()
})
