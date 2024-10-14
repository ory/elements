// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from "@playwright/experimental-ct-react"
import { Node } from "./node"

test("hidden input field shouldn't show label", async ({ mount }) => {
  const component = await mount(
    <Node
      node={{
        group: "default",
        attributes: {
          name: "name",
          disabled: false,
          type: "hidden",
          node_type: "input",
          label: {
            type: "info",
            text: "Hidden input",
            id: 1234,
          },
        },
        messages: [],
        meta: {},
        type: "input",
      }}
    />,
  )

  await expect(component).toBeHidden()
})

test("uiTextToFormattedMessage on a list", async ({ mount }) => {
  const component = await mount(
    <Node
      node={{
        type: "text",
        group: "lookup_secret",
        attributes: {
          text: {
            id: 1050015,
            text: "3r9noma8, tv14n5tu",
            type: "info",
            context: {
              secrets: [
                {
                  context: {
                    secret: "3r9noma8",
                  },
                  id: 1050009,
                  text: "3r9noma8",
                  type: "info",
                },
                {
                  context: {
                    secret: "tv14n5tu",
                  },
                  id: 1050009,
                  text: "tv14n5tu",
                  type: "info",
                },
                {
                  context: {
                    secret: "te45pbc0",
                  },
                  id: 1050009,
                  text: "te45pbc0",
                  type: "info",
                },
                {
                  context: {
                    secret: "juuri7u3",
                  },
                  id: 1050009,
                  text: "juuri7u3",
                  type: "info",
                },
                {
                  context: {
                    secret: "zp8df6fe",
                  },
                  id: 1050009,
                  text: "zp8df6fe",
                  type: "info",
                },
                {
                  context: {
                    secret: "dhxbkfmv",
                  },
                  id: 1050009,
                  text: "dhxbkfmv",
                  type: "info",
                },
                {
                  context: {
                    secret: "rwu6svpj",
                  },
                  id: 1050009,
                  text: "rwu6svpj",
                  type: "info",
                },
                {
                  context: {
                    secret: "evv9pedj",
                  },
                  id: 1050009,
                  text: "evv9pedj",
                  type: "info",
                },
                {
                  context: {
                    secret: "v37k7nxv",
                  },
                  id: 1050009,
                  text: "v37k7nxv",
                  type: "info",
                },
                {
                  context: {
                    secret: "pqhtefs4",
                  },
                  id: 1050009,
                  text: "pqhtefs4",
                  type: "info",
                },
                {
                  context: {
                    secret: "mrwstrmp",
                  },
                  id: 1050009,
                  text: "mrwstrmp",
                  type: "info",
                },
                {
                  context: {
                    secret: "q3vvtd4i",
                  },
                  id: 1050009,
                  text: "q3vvtd4i",
                  type: "info",
                },
              ],
            },
          },
          id: "lookup_secret_codes",
          node_type: "text",
        },
        messages: [],
        meta: {
          label: {
            id: 1050010,
            text: "These are your back up recovery codes. Please keep them in a safe place!",
            type: "info",
          },
        },
      }}
    />,
  )

  await expect(component).toContainText(
    "These are your back up recovery codes. Please keep them in a safe place!",
  )
  await expect(component).toContainText("te45pbc0")
  await expect(component).toContainText("q3vvtd4i")
})

test("button with id 1070007 should have formnovalidate", async ({ mount }) => {
  const component = await mount(
    <Node
      node={{
        type: "input",
        group: "default",
        attributes: {
          id: "111111",
          name: "resend",
          value: "code",
          type: "submit",
          node_type: "input",
          required: true,
          disabled: false,
        },
        messages: [],
        meta: {
          label: {
            id: 1070007,
            text: "",
            type: "info",
          },
        },
      }}
    />,
  )

  // formnovalidate is inline and won't work with the .toHaveAttribute matcher
  await expect(component.locator("[formnovalidate]")).toBeAttached()
  // text is injected from the translation file
  await expect(component).toHaveText("Email")
})

test("button with label id 1070008 should have formnovalidate", async ({
  mount,
}) => {
  const component = await mount(
    <Node
      node={{
        type: "input",
        group: "default",
        attributes: {
          id: "111111",
          name: "resend",
          value: "code",
          type: "submit",
          node_type: "input",
          required: true,
          disabled: false,
        },
        messages: [],
        meta: {
          label: {
            id: 1070008,
            text: "",
            type: "info",
          },
        },
      }}
    />,
  )

  // formnovalidate is inline and won't work with the .toHaveAttribute matcher
  await expect(component.locator("[formnovalidate]")).toBeAttached()
  // text is injected from the translation file
  await expect(component).toHaveText("Resend code")
})
