// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/experimental-ct-react"
import { loginCodeFixture } from "../../../test"
import { AuthCodeSection } from "./auth-code-section"

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
              id: 1070008,
              text: "Resend Code",
              type: "info",
            },
          },
        },
        {
          group: "code",
          attributes: {
            name: "method",
            node_type: "input",
            type: "hidden",
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
            disabled: false,
            value: "code",
          },
          messages: [],
          type: "input",
          meta: {
            label: {
              id: 1070005,
              text: "Sign up with code",
              type: "info",
            },
          },
        },
      ]}
    />,
  )
  await expect(container.locator("input[name=code]")).toBeVisible()
  await expect(
    container.locator('input[name=method][value="code"]'),
  ).toBeAttached()
  await expect(container.locator("button[name=resend]")).toBeVisible()
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

  await expect(container.locator("input[name=identifier]")).toBeHidden()
})

test("should render traits on default group", async ({ mount }) => {
  const container = await mount(
    <AuthCodeSection
      nodes={[
        {
          group: "default",
          attributes: {
            name: "traits.email",
            node_type: "input",
            type: "text",
            required: true,
            disabled: false,
          },
          messages: [],
          type: "input",
          meta: {
            label: {
              id: 1070002,
              text: "E-Mail",
              type: "info",
              context: {
                title: "E-Mail",
              },
            },
          },
        },
        {
          group: "default",
          attributes: {
            name: "traits.name",
            node_type: "input",
            type: "text",
            required: true,
            disabled: false,
          },
          messages: [],
          type: "input",
          meta: {
            label: {
              id: 1070001,
              text: "Name",
              type: "info",
            },
          },
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

  await expect(container.locator("input[name='traits.email']")).toBeVisible()
  await expect(container.locator("input[name='traits.name']")).toBeVisible()
  await expect(container.locator("button[name=method]")).toBeVisible()
})
