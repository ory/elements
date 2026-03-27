// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { screen } from "@testing-library/react"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { Node } from "../node"

beforeEach(() => {
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

test("should render checkbox error messages only once", () => {
  renderWithOryElements(
    <IntlProvider locale="en">
      <Node
        node={{
          type: "input",
          group: "profile",
          attributes: {
            name: "traits.accepted_tos",
            type: "checkbox",
            disabled: false,
            node_type: "input",
          },
          messages: [
            {
              id: 4000001,
              text: "Property accepted_tos is missing.",
              type: "error",
              context: {
                property: "accepted_tos",
              },
            },
          ],
          meta: {
            label: {
              id: 1070002,
              text: "I accept the Terms of Service",
              type: "info",
              context: {
                name: "traits.accepted_tos",
                title: "I accept the Terms of Service",
              },
            },
          },
        }}
      />
    </IntlProvider>,
  )

  const errorMessages = screen.getAllByTestId("ory/message/4000001")
  expect(errorMessages).toHaveLength(1)
})

test("should render checkbox without error messages when none exist", () => {
  renderWithOryElements(
    <IntlProvider locale="en">
      <Node
        node={{
          type: "input",
          group: "profile",
          attributes: {
            name: "traits.accepted_tos",
            type: "checkbox",
            disabled: false,
            node_type: "input",
          },
          messages: [],
          meta: {
            label: {
              id: 1070002,
              text: "I accept the Terms of Service",
              type: "info",
              context: {
                name: "traits.accepted_tos",
                title: "I accept the Terms of Service",
              },
            },
          },
        }}
      />
    </IntlProvider>,
  )

  expect(
    screen.getByTestId("ory/form/node/input/traits.accepted_tos"),
  ).toBeInTheDocument()
  expect(screen.queryAllByTestId(/ory\/message\//)).toHaveLength(0)
})

test("should render multiple checkbox error messages only once each", () => {
  renderWithOryElements(
    <IntlProvider locale="en">
      <Node
        node={{
          type: "input",
          group: "profile",
          attributes: {
            name: "traits.accepted_tos",
            type: "checkbox",
            disabled: false,
            node_type: "input",
          },
          messages: [
            {
              id: 4000001,
              text: "Property accepted_tos is missing.",
              type: "error",
              context: {
                property: "accepted_tos",
              },
            },
            {
              id: 4000002,
              text: "This field is required",
              type: "error",
            },
          ],
          meta: {
            label: {
              id: 1070002,
              text: "I accept the Terms of Service",
              type: "info",
              context: {
                name: "traits.accepted_tos",
                title: "I accept the Terms of Service",
              },
            },
          },
        }}
      />
    </IntlProvider>,
  )

  expect(screen.getAllByTestId("ory/message/4000001")).toHaveLength(1)
  expect(screen.getAllByTestId("ory/message/4000002")).toHaveLength(1)
})
