// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { screen } from "@testing-library/react"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import {
  OryNodeConsentResourceProps,
  OryNodeTextProps,
} from "../../../../types"
import { requestedResourceNodeIdPrefix } from "../../../../util/consent"
import { Node } from "../node"

const resource = "https://resource.example.com/calendar"

function textNode(id: string, text: string): UiNode {
  return {
    type: "text",
    group: UiNodeGroupEnum.Oauth2Consent,
    meta: {},
    attributes: {
      id,
      node_type: "text",
      text: { id: 9999111, text, type: "info", context: {} },
    },
    messages: [],
  }
}

function CustomResource({ resource }: OryNodeConsentResourceProps) {
  return <div data-testid="custom-resource">{resource}</div>
}

function CustomText({ node }: OryNodeTextProps) {
  return <div data-testid="custom-text">{node.attributes.text.text}</div>
}

test("should render requested resources with Node.ConsentResource", () => {
  renderWithOryElements(
    <IntlProvider locale="en">
      <Node node={textNode(`${requestedResourceNodeIdPrefix}0`, resource)} />
    </IntlProvider>,
    {
      components: {
        Node: { ConsentResource: CustomResource, Text: CustomText },
      },
    },
  )

  expect(screen.getByTestId("custom-resource")).toHaveTextContent(resource)
  expect(screen.queryByTestId("custom-text")).not.toBeInTheDocument()
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
})

test("should render other consent text nodes with Node.Text", () => {
  renderWithOryElements(
    <IntlProvider locale="en">
      <Node node={textNode("some_other_text", "Hello")} />
    </IntlProvider>,
    {
      components: {
        Node: { ConsentResource: CustomResource, Text: CustomText },
      },
    },
  )

  expect(screen.getByTestId("custom-text")).toHaveTextContent("Hello")
  expect(screen.queryByTestId("custom-resource")).not.toBeInTheDocument()
})

test("should not treat resource-like text nodes outside the consent group as resources", () => {
  renderWithOryElements(
    <IntlProvider locale="en">
      <Node
        node={{
          ...textNode(`${requestedResourceNodeIdPrefix}0`, resource),
          group: UiNodeGroupEnum.Default,
        }}
      />
    </IntlProvider>,
    {
      components: {
        Node: { ConsentResource: CustomResource, Text: CustomText },
      },
    },
  )

  expect(screen.getByTestId("custom-text")).toBeInTheDocument()
  expect(screen.queryByTestId("custom-resource")).not.toBeInTheDocument()
})
