// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { screen } from "@testing-library/react"
import { useOryBlockNativeSubmit } from "../../../../context/submit-gate"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { Node } from "../node"

beforeEach(() => {
  console.error = jest.fn()
})

function button(name: string, label: string, onclickTrigger?: string): UiNode {
  return {
    type: "input",
    group: "webauthn",
    attributes: {
      name,
      type: onclickTrigger ? "button" : "submit",
      value: "",
      disabled: false,
      node_type: "input",
      ...(onclickTrigger ? { onclickTrigger } : {}),
    } as unknown as never,
    messages: [],
    meta: { label: { id: 1, text: label, type: "info" } },
  }
}

function BlockNativeSubmit({ blocked }: { blocked: boolean }) {
  useOryBlockNativeSubmit(blocked)
  return null
}

function renderButtons(blocked: boolean) {
  return renderWithOryElements(
    <IntlProvider locale="en">
      <BlockNativeSubmit blocked={blocked} />
      <Node
        node={button(
          "webauthn_login_trigger",
          "Use security key",
          "oryWebAuthnLogin",
        )}
      />
      <Node node={button("method", "Continue")} />
    </IntlProvider>,
  )
}

test("should disable buttons that submit natively while native submits are blocked", () => {
  renderButtons(true)

  expect(
    screen.getByRole("button", { name: "Use security key" }),
  ).toBeDisabled()
  expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled()
})

test("should enable buttons that submit natively when nothing blocks them", () => {
  renderButtons(false)

  expect(screen.getByRole("button", { name: "Use security key" })).toBeEnabled()
})
