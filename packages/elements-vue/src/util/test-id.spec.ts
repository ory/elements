// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { messageTestId } from "./test-id"

describe("messageTestId", () => {
  it("generates test id for numeric message id", () => {
    const result = messageTestId({ id: 4000006 })
    expect(result).toEqual({ "data-testid": "ory/message/4000006" })
  })

  it("generates test id for string message id", () => {
    const result = messageTestId({ id: "custom-error" })
    expect(result).toEqual({ "data-testid": "ory/message/custom-error" })
  })

  it("handles zero id", () => {
    const result = messageTestId({ id: 0 })
    expect(result).toEqual({ "data-testid": "ory/message/0" })
  })

  it("handles empty string id", () => {
    const result = messageTestId({ id: "" })
    expect(result).toEqual({ "data-testid": "ory/message/" })
  })
})
