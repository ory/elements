// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AuthenticatorAssuranceLevel,
  FlowType,
  UiContainer,
  UiNode,
} from "@ory/client-fetch"
import { renderHook } from "@testing-library/react"
import { PropsWithChildren } from "react"
import { IntlProvider } from "react-intl"
import { FormState } from "../../../context"
import enMessages from "../../../locales/en.json"
import { CardHeaderTextOptions, useCardHeaderText } from "./constructCardHeader"

const wrapper = ({ children }: PropsWithChildren) => (
  <IntlProvider locale="en" messages={enMessages}>
    {children}
  </IntlProvider>
)

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

function container(nodes: UiNode[], messages: unknown[] = []) {
  // The messages parameter is intentionally loose so tests can pass literal
  // fixtures without fully modeling the UiText enum types.
  return { nodes, messages } as unknown as UiContainer
}

const aal2CodeActiveOpts: CardHeaderTextOptions = {
  flowType: FlowType.Login,
  flow: { requested_aal: AuthenticatorAssuranceLevel.Aal2 },
  formState: { current: "method_active", method: "code" } as FormState,
}

test("should announce the second factor code by SMS for an sms address", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container([addressNode("sms", "+4746788587")]),
        aal2CodeActiveOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toBe(
    "A verification code will be sent by SMS",
  )
})

test("should announce the second factor code by email for an email address", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container([addressNode("email", "user@example.com")]),
        aal2CodeActiveOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toBe(
    "A verification code will be sent by email",
  )
})

test("should announce the second factor code by email when the channel is unknown", () => {
  const { result } = renderHook(
    () => useCardHeaderText(container([]), aal2CodeActiveOpts),
    { wrapper },
  )

  expect(result.current.description).toBe(
    "A verification code will be sent by email",
  )
})

function codeInputNode(): UiNode {
  return {
    type: "input",
    group: "code",
    messages: [],
    meta: {},
    attributes: {
      node_type: "input",
      name: "code",
      type: "text",
      disabled: false,
    },
  } as unknown as UiNode
}

function verificationAddressInputNode(labelId: number, label: string): UiNode {
  return {
    type: "input",
    group: "code",
    messages: [],
    meta: { label: { id: labelId, text: label, type: "info" } },
    attributes: {
      node_type: "input",
      name: "email",
      type: "text",
      disabled: false,
    },
  } as unknown as UiNode
}

function verificationResendNode(value: string): UiNode {
  // After the code was sent, Kratos appends a resend node in the "code"
  // group named "email" holding the address the user typed, even when that
  // address is a phone number.
  return {
    type: "input",
    group: "code",
    messages: [],
    meta: {},
    attributes: {
      node_type: "input",
      name: "email",
      type: "submit",
      value,
      disabled: false,
    },
  } as unknown as UiNode
}

const verificationOpts: CardHeaderTextOptions = {
  flowType: FlowType.Verification,
}

test("should use the SMS sent message when the verification flow reports message 1080004", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container(
          [codeInputNode()],
          [
            {
              id: 1080004,
              text: "A text message containing a verification code has been sent to the phone number you provided. If you have not received a text message, check the spelling of the number and make sure to use the number you registered with.",
              type: "info",
            },
          ],
        ),
        verificationOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toContain("A text message containing")
  expect(result.current.messageId).toBe("1080004")
})

test("should keep the email sent message when the verification flow has no SMS message", () => {
  const { result } = renderHook(
    () => useCardHeaderText(container([codeInputNode()]), verificationOpts),
    { wrapper },
  )

  expect(result.current.description).toContain("An email containing")
  expect(result.current.messageId).toBe("1080003")
})

test("should keep the SMS sent message on a wrong-code retry, when Kratos cleared the messages", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container([codeInputNode(), verificationResendNode("+4746788587")]),
        verificationOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toContain("A text message containing")
  expect(result.current.messageId).toBe("1080004")
})

test("should keep the email sent message on a wrong-code retry with an email address", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container([
          codeInputNode(),
          verificationResendNode("user@example.com"),
        ]),
        verificationOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toContain("An email containing")
  expect(result.current.messageId).toBe("1080003")
})

test("should mention phone numbers in the subtitle when the input is labeled email or phone", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container([
          verificationAddressInputNode(1070018, "Email or phone number"),
        ]),
        verificationOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toBe(
    "Enter the email address or phone number associated with your account to verify it",
  )
})

test("should keep the email subtitle when the input is labeled email", () => {
  const { result } = renderHook(
    () =>
      useCardHeaderText(
        container([verificationAddressInputNode(1070011, "Email")]),
        verificationOpts,
      ),
    { wrapper },
  )

  expect(result.current.description).toBe(
    "Enter the email address associated with your account to verify it",
  )
})
