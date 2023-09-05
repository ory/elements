import { loginCodeFixture } from "../../../test"
import { AuthCodeSection } from "./auth-code-section"
import { expect, test } from "@playwright/experimental-ct-react"

test("should render when ui nodes contain `code` group", async ({ mount }) => {
  const container = await mount(
    <AuthCodeSection
      nodes={[
        {
          group: "code",
          attributes: {
            name: "code",
            node_type: "input",
            type: "text",
            required: true,
            disabled: false,
          },
          messages: [],
          type: "input",
          meta: {
            label: {
              id: 10000,
              text: "Enter Code",
              type: "info",
            },
          },
        },
        {
          group: "code",
          attributes: {
            name: "resend",
            node_type: "hidden",
            type: "hidden",
            required: true,
            disabled: false,
            value: "code",
          },
          messages: [],
          type: "input",
          meta: {},
        },
        {
          group: "code",
          attributes: {
            name: "method",
            node_type: "input",
            type: "submit",
            required: true,
            disabled: false,
            value: "code",
          },
          messages: [],
          type: "input",
          meta: {
            label: {
              id: 1040006,
              text: "Sign up with code",
              type: "info",
            },
          },
        },
      ]}
    />,
  )
  await expect(container.locator("input[name=code]")).toBeVisible()
  await expect(container.locator("input[name=resend]")).toBeHidden()
  await expect(container.locator("button[name=method]")).toBeVisible()
})

test("should render login identifier", async ({ mount }) => {
  const container = await mount(
    <AuthCodeSection nodes={loginCodeFixture.ui.nodes} />,
  )
  await expect(container.locator("input[name=identifier]")).toBeVisible()
  await expect(container.locator("button[name=method]")).toBeVisible()
})

test("shouldn't render anything with no code group", async ({ mount }) => {
  const container = await mount(
    <AuthCodeSection
      nodes={[
        {
          group: "default",
          attributes: {
            name: "identifier",
            node_type: "input",
            type: "text",
            required: true,
            disabled: false,
          },
          messages: [],
          type: "input",
          meta: {
            label: {
              id: 10000,
              text: "Email",
              type: "info",
            },
          },
        },
      ]}
    />,
  )

  await expect(container.locator("input[name=identifier]")).not.toBeVisible()
})
