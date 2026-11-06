// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiText } from "@ory/client-fetch"
import { createIntl } from "react-intl"
import { OryFlowContainer } from "../flowContainer"
import {
  appendUiMessage,
  rateLimitedMessage,
  rateLimitedMessageId,
} from "../rateLimitedMessage"

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

const intl = createIntl({ locale: "en", messages: {}, onError: () => {} })

test("should return the generic message for a rate limit without an Ory error", () => {
  expect(
    rateLimitedMessage(
      { type: "rate_limited", flowType: FlowType.Login, retryAfter: 5 },
      intl,
    ),
  ).toEqual(message)
})

describe("login throttle", () => {
  const now = new Date("2026-01-01T00:00:00Z")

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test("should return the login throttle message with the seconds from the error details", () => {
    // The Retry-After header is unreadable cross-origin unless the server
    // exposes it, so the error details are the source that always arrives.
    expect(
      rateLimitedMessage(
        {
          type: "rate_limited",
          flowType: FlowType.Login,
          retryAfter: 5,
          body: {
            error: {
              id: "login_throttled",
              message: "too many failed login attempts",
              details: { retry_after: 30 },
            },
          },
        },
        intl,
      ),
    ).toEqual({
      id: 4010012,
      type: "error",
      text: "Too many failed login attempts. Please try again in 30 seconds.",
      context: { retry_after: 30, retry_at_unix: now.getTime() / 1000 + 30 },
    })
  })

  test("should take the seconds from the Retry-After header without error details", () => {
    expect(
      rateLimitedMessage(
        {
          type: "rate_limited",
          flowType: FlowType.Login,
          retryAfter: 5,
          body: {
            error: { id: "login_throttled", message: "too many attempts" },
          },
        },
        intl,
      ).context,
    ).toEqual({ retry_after: 5, retry_at_unix: now.getTime() / 1000 + 5 })
  })

  test("should return the generic message when the wait is unknown", () => {
    expect(
      rateLimitedMessage(
        {
          type: "rate_limited",
          flowType: FlowType.Login,
          body: {
            error: { id: "login_throttled", message: "too many attempts" },
          },
        },
        intl,
      ),
    ).toEqual(message)
  })
})
