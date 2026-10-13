// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { screen } from "@testing-library/react"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { Node } from "../node"

// jsdom does not implement ResizeObserver, which the pin code input uses.
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

beforeEach(() => {
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

function renderCodeInput(maxlength: number, inputmode: "numeric" | "text") {
  return renderWithOryElements(
    <IntlProvider locale="en">
      <Node
        node={{
          type: "input",
          group: "code",
          attributes: {
            name: "code",
            type: "text",
            required: true,
            disabled: false,
            node_type: "input",
            autocomplete: "one-time-code",
            maxlength,
            inputmode,
            // `inputmode` is not yet declared on the published SDK type, so
            // widen via `unknown` until `@ory/client-fetch` carries the field.
          } as unknown as never,
          messages: [],
          meta: {
            label: { id: 1070012, text: "Login code", type: "info" },
          },
        }}
      />
    </IntlProvider>,
  )
}

test("should render a six digit code as a pin code input with a numeric keyboard", () => {
  renderCodeInput(6, "numeric")

  const input = screen.getByTestId("ory/form/node/input/code")
  expect(input).toHaveAttribute("data-input-otp", "true")
  expect(input).toHaveAttribute("inputmode", "numeric")
  expect(input).toHaveAttribute("maxlength", "6")
})

test("should render a short alphanumeric code as a pin code input with a text keyboard", () => {
  renderCodeInput(8, "text")

  const input = screen.getByTestId("ory/form/node/input/code")
  expect(input).toHaveAttribute("data-input-otp", "true")
  expect(input).toHaveAttribute("inputmode", "text")
})

test("should render a code longer than eight characters as a single text input", () => {
  renderCodeInput(12, "text")

  const input = screen.getByTestId("ory/form/node/input/code")
  expect(input).not.toHaveAttribute("data-input-otp")
  expect(input).toHaveAttribute("inputmode", "text")
  expect(input).toHaveAttribute("maxlength", "12")
  expect(input).toHaveAttribute("autocomplete", "one-time-code")
})
