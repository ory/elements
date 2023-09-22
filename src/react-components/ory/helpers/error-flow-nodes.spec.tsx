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
