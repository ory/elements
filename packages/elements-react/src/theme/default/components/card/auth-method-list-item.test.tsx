// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode } from "@ory/client-fetch"
import * as oryFlow from "@ory/elements-react"
import { render, screen } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import enMessages from "../../../../locales/en.json"
import { DefaultAuthMethodListItem } from "./auth-method-list-item"

jest.mock("@ory/elements-react", (): unknown => ({
  ...jest.requireActual("@ory/elements-react"),
  useOryFlow: jest.fn(),
}))

jest.mock(
  "../../assets/icons/code.svg",
  () =>
    function CodeIcon() {
      return <svg data-testid="icon-code" />
    },
)
jest.mock(
  "../../assets/icons/phone.svg",
  () =>
    function PhoneIcon() {
      return <svg data-testid="icon-phone" />
    },
)

function mockFlowWithNodes(nodes: UiNode[]) {
  jest.mocked(oryFlow.useOryFlow).mockReturnValue({
    flowType: FlowType.Login,
    flow: { ui: { nodes } },
  } as unknown as ReturnType<typeof oryFlow.useOryFlow>)
}

function addressNode(channel: string, to: string): UiNode {
  return {
    type: "input",
    group: "code",
    messages: [],
    meta: {
      label: {
        id: 1010023,
        text: `Send code to ${to}`,
        type: "info",
        context: { address: to, channel },
      },
    },
    attributes: {
      node_type: "input",
      name: "address",
      type: "submit",
      value: to,
      disabled: false,
    },
  } as unknown as UiNode
}

function renderItem() {
  return render(
    <IntlProvider locale="en" messages={enMessages}>
      <DefaultAuthMethodListItem group="code" onClick={jest.fn()} />
    </IntlProvider>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

test("should describe the code method as SMS with a phone icon for an sms address", () => {
  mockFlowWithNodes([addressNode("sms", "+4746788587")])
  renderItem()

  expect(screen.getByText("Send code to +4746788587")).toBeInTheDocument()
  expect(
    screen.getByText("A verification code will be sent to your phone"),
  ).toBeInTheDocument()
  expect(screen.getByTestId("icon-phone")).toBeInTheDocument()
})

test("should keep the email wording and icon for an email address", () => {
  mockFlowWithNodes([addressNode("email", "user@example.com")])
  renderItem()

  expect(
    screen.getByText("A verification code will be sent to your email"),
  ).toBeInTheDocument()
  expect(screen.getByTestId("icon-code")).toBeInTheDocument()
})

test("should keep the email wording when the channel is unknown", () => {
  mockFlowWithNodes([])
  renderItem()

  expect(
    screen.getByText("A verification code will be sent to your email"),
  ).toBeInTheDocument()
  expect(screen.getByTestId("icon-code")).toBeInTheDocument()
})
