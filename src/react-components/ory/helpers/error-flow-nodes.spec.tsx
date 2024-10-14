// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/experimental-ct-react"
import { NodeMessages } from "./error-messages"

test("should render error message", async ({ mount }) => {
  const component = await mount(
    <NodeMessages
      severity="error"
      uiMessages={[
        {
          id: 4000010,
          text: "Account not active yet. Did you forget to verify your email address?",
          context: {},
          type: "error",
        },
      ]}
    />,
  )
  await expect(
    component.locator("[data-testid='ui/message/4000010']"),
  ).toBeVisible()
  await expect(component).toContainText(
    "Account not active yet. Did you forget to verify your email address?",
  )
})

test("should render info message", async ({ mount }) => {
  const component = await mount(
    <NodeMessages
      severity="info"
      uiMessages={[
        {
          id: 1080002,
          text: "You successfully verified your email address.",
          context: {},
          type: "info",
        },
      ]}
    />,
  )

  await expect(
    component.locator("[data-testid='ui/message/1080002']"),
  ).toBeVisible()
  await expect(component).toContainText(
    "You successfully verified your email address.",
  )
})

test("can render multiple messages", async ({ mount }) => {
  const component = await mount(
    <NodeMessages
      severity="info"
      uiMessages={[
        {
          id: 1080002,
          text: "You successfully verified your email address.",
          context: {},
          type: "info",
        },
      ]}
      nodes={[
        {
          group: "default",
          type: "input",
          attributes: {
            name: "traits.name",
            type: "text",
            value: "",
            disabled: false,
            node_type: "input",
          },
          messages: [
            {
              id: 4000002,
              text: "Property {property} is missing.",
              context: {
                property: "name",
              },
              type: "info",
            },
          ],
          meta: {},
        },
      ]}
    />,
  )

  await expect(
    component.locator("[data-testid='ui/message/4000002']"),
  ).toBeVisible()

  await expect(component).toContainText("Property name is missing.")

  await expect(component).toContainText(
    "You successfully verified your email address.",
  )
  await expect(
    component.locator("[data-testid='ui/message/1080002']"),
  ).toBeVisible()
})

test("message unix expired_at timestamp with formatted date", async ({
  mount,
}) => {
  const component = await mount(
    <NodeMessages
      severity="info"
      uiMessages={[
        {
          id: 4010001,
          text: "The login flow expired",
          type: "error",
          context: {
            expired_at_unix: Math.floor(
              new Date(Date.now() - 1000 * 60 * 10).getTime() / 1000,
            ),
          },
        },
      ]}
    />,
  )

  // we check relative time here, because the test runner might be a bit slow
  await expect(component).toContainText(
    /The login flow expired (9|10)\.[0-9]{2} minutes ago, please try again\./,
  )
})

test("message unix until minutes with formatted date", async ({ mount }) => {
  const component = await mount(
    <NodeMessages
      severity="info"
      uiMessages={[
        {
          id: 1060001,
          text: "You successfully recovered your account",
          type: "info",
          context: {
            privileged_session_expires_at_unix: Math.floor(
              new Date(Date.now() + 1000 * 60 * 10).getTime() / 1000,
            ),
          },
        },
      ]}
    />,
  )

  // we check relative time here, because the test runner might be a bit slow
  await expect(component).toContainText(
    /You successfully recovered your account\. Please change your password or set up an alternative login method \(e\.g\. social sign in\) within the next (9|10)\.[0-9]{2} minutes\./,
  )
})
