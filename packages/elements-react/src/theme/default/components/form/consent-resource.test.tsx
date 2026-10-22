// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeGroupEnum } from "@ory/client-fetch"
import { requestedResourcesTitleNodeId, UiNodeText } from "@ory/elements-react"
import { render, screen } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import { DefaultConsentResource } from "./consent-resource"
import { DefaultText } from "./text"

function renderResource(resource: string) {
  const node: UiNodeText = {
    type: "text",
    group: UiNodeGroupEnum.Oauth2Consent,
    meta: {},
    attributes: {
      id: "requested_resource_0",
      node_type: "text",
      text: { id: 9999111, text: resource, type: "info", context: {} },
    },
    messages: [],
  }
  return render(
    <IntlProvider locale="en">
      <DefaultConsentResource node={node} resource={resource} />
    </IntlProvider>,
  )
}

test.each([
  "https://api.example.com/calendar",
  "https://api.example.com:8443/",
  "urn:example:resource",
])("should show %s exactly once", (resource) => {
  renderResource(resource)

  expect(screen.getByTestId("ory/screen/consent/resource")).toHaveTextContent(
    resource,
  )
  expect(screen.getAllByText(resource)).toHaveLength(1)
})

test("should render ICU syntax characters verbatim", () => {
  const resource = "https://api.example.com/it's/{tenant}?q={a}"
  renderResource(resource)

  expect(screen.getByText(resource)).toBeInTheDocument()
})

test("should not render the resource as a link or an input", () => {
  renderResource("https://api.example.com/calendar")

  expect(screen.queryByRole("link")).not.toBeInTheDocument()
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
  expect(screen.queryByRole("switch")).not.toBeInTheDocument()
})

test("should translate the requested resources heading", () => {
  render(
    <IntlProvider
      locale="de"
      messages={{ "consent.resources.title": "Übersetzte Überschrift" }}
    >
      <DefaultText
        node={{
          type: "text",
          group: UiNodeGroupEnum.Oauth2Consent,
          meta: {},
          attributes: {
            id: requestedResourcesTitleNodeId,
            node_type: "text",
            text: {
              id: 9999111,
              text: "This application will access these services on your behalf:",
              type: "info",
              context: {},
            },
          },
          messages: [],
        }}
        attributes={{
          id: requestedResourcesTitleNodeId,
          node_type: "text",
          text: { id: 9999111, text: "", type: "info" },
        }}
      />
    </IntlProvider>,
  )

  expect(screen.getByText("Übersetzte Überschrift")).toBeInTheDocument()
})
