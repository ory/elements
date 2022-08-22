import React from "react"
import { expect, test } from "@playwright/experimental-ct-react"
import { SelfServiceAuthCard } from "./self-service-auth-card"
import { SelfServiceFlow } from "../../types"
import { Locator } from "playwright-core"

const defaultFlow: SelfServiceFlow = {
  id: "",
  state: "choose_method",
  type: "browser",
  ui: {
    action: "https://test.com",
    method: "POST",
    nodes: [
      {
        group: "default",
        attributes: {
          name: "id",
          type: "text",
          node_type: "input",
          disabled: false,
          required: true,
        },
        messages: [],
        type: "input",
        meta: {
          label: {
            id: 1,
            text: "ID",
            type: "text",
          },
        },
      },
      {
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          node_type: "input",
          disabled: false,
        },
        messages: [],
        type: "input",
        meta: {},
      },
      {
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          node_type: "input",
          disabled: false,
          required: true,
        },
        messages: [],
        type: "input",
        meta: {
          label: {
            id: 1,
            text: "Password",
            type: "text",
          },
        },
      },
      {
        group: "password",
        attributes: {
          name: "submit",
          type: "submit",
          node_type: "input",
          disabled: false,
        },
        messages: [],
        type: "input",
        meta: {
          label: {
            id: 1,
            text: "Submit",
            type: "text",
          },
        },
      },
    ],
  },
}

const expectDefaultFlow = async (component: Locator) => {
  await expect(component).toContainText("ID *")
  await expect(component).toContainText("Password *")
  await expect(component.locator('input[name="id"]')).toBeVisible()
  await expect(component.locator('input[name="password"]')).toBeVisible()
  await expect(component.locator('input[name="csrf_token"]')).toBeHidden()
  await expect(component.locator('button[name="submit"]')).toBeVisible()
  await expect(component.locator('button[name="submit"]')).toHaveText("Submit")
  await expect(
    component.locator('form[action="https://test.com"]'),
  ).toBeVisible()
}

test("ory auth card login flow", async ({ mount }) => {
  const component = await mount(
    <SelfServiceAuthCard
      title={"Sign in"}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/forgot",
        signupURL: "/signup",
      }}
      flow={defaultFlow}
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

  await expectDefaultFlow(component)
})

test("ory auth card registration flow", async ({ mount }) => {
  const component = await mount(
    <SelfServiceAuthCard
      title="Sign up"
      flowType="registration"
      additionalProps={{
        loginURL: "/login",
      }}
      flow={defaultFlow}
    />,
  )

  await expect(component).toContainText("Sign up", { ignoreCase: true })
  await expect(component).toContainText("Already have an account?", {
    ignoreCase: true,
  })
  await expect(
    component.locator('a[data-testid="login-link"]'),
  ).toHaveAttribute("href", "/login")

  await expectDefaultFlow(component)
})

// test("ory auth card verification flow", async ({ mount }) => {
//   const component = await mount(<SelfServiceAuthCard
//   flow={}/>
// })
