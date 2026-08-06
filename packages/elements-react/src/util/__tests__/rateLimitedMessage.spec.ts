// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiText } from "@ory/client-fetch"
import { OryFlowContainer } from "../flowContainer"
import { appendUiMessage, rateLimitedMessageId } from "../rateLimitedMessage"

const message: UiText = {
  id: rateLimitedMessageId,
  type: "error",
  text: "Too many requests. Please wait a moment and try again.",
}

function makeContainer(messages?: UiText[]): OryFlowContainer {
  return {
    flowType: FlowType.Login,
    flow: { id: "flow-id", ui: { nodes: [], messages } },
  } as unknown as OryFlowContainer
}

test("should append the message to a flow without messages", () => {
  const result = appendUiMessage(makeContainer(undefined), message)
  expect(result.flow.ui.messages).toEqual([message])
})

test("should append the message after existing messages", () => {
  const existing: UiText = { id: 4000006, type: "error", text: "wrong creds" }
  const result = appendUiMessage(makeContainer([existing]), message)
  expect(result.flow.ui.messages).toEqual([existing, message])
})

test("should not duplicate the message on repeated 429s", () => {
  const once = appendUiMessage(makeContainer([]), message)
  const twice = appendUiMessage(once, message)
  expect(twice.flow.ui.messages).toEqual([message])
})

test("should not mutate the input container", () => {
  const container = makeContainer([])
  appendUiMessage(container, message)
  expect(container.flow.ui.messages).toEqual([])
})
