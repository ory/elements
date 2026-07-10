// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { findCodeChannel } from "./index"

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

function identifierFirstNode(value: string): UiNode {
  return {
    type: "input",
    group: "identifier_first",
    messages: [],
    meta: { label: { id: 1070004, text: "ID", type: "info" } },
    attributes: {
      node_type: "input",
      name: "identifier",
      type: "hidden",
      value,
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

function hiddenSentIdentifierNode(channel: string, to: string): UiNode {
  // After the code was sent, Kratos renames the address node to a hidden
  // "identifier" input in the code group but keeps the 1010023 label.
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
      name: "identifier",
      type: "hidden",
      value: to,
      disabled: false,
    },
  } as unknown as UiNode
}

test("should return sms for an address node with an sms channel context", () => {
  expect(findCodeChannel([addressNode("sms", "+4746788587")])).toBe("sms")
})

test("should return email for an address node with an email channel context", () => {
  expect(findCodeChannel([addressNode("email", "user@example.com")])).toBe(
    "email",
  )
})

test("should find the channel on the hidden identifier node after the code was sent", () => {
  expect(
    findCodeChannel([hiddenSentIdentifierNode("sms", "+4746788587")]),
  ).toBe("sms")
})

test("should infer sms from a phone-shaped identifier without channel context", () => {
  expect(findCodeChannel([identifierFirstNode("+4746788587")])).toBe("sms")
})

test("should infer sms from a masked phone identifier", () => {
  expect(findCodeChannel([identifierFirstNode("+4746****87")])).toBe("sms")
})

test("should infer email from an email-shaped identifier without channel context", () => {
  expect(findCodeChannel([identifierFirstNode("user@example.com")])).toBe(
    "email",
  )
})

test("should return undefined for a username identifier", () => {
  expect(findCodeChannel([identifierFirstNode("johndoe")])).toBeUndefined()
})

test("should return undefined for an unknown channel value", () => {
  expect(
    findCodeChannel([addressNode("carrier-pigeon", "somewhere")]),
  ).toBeUndefined()
})

test("should return undefined when no nodes are present", () => {
  expect(findCodeChannel([])).toBeUndefined()
})

test("should infer sms from the verification resend node's phone value", () => {
  expect(findCodeChannel([verificationResendNode("+4746788587")])).toBe("sms")
})

test("should infer email from the verification resend node's email value", () => {
  expect(findCodeChannel([verificationResendNode("user@example.com")])).toBe(
    "email",
  )
})
