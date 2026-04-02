// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiContainer } from "@ory/client-fetch"
import { flowHasErrors } from "./flowHasErrors"

describe("flowHasErrors", () => {
  test("should return true when top-level messages contain errors", () => {
    const ui = {
      action: "",
      method: "POST",
      nodes: [],
      messages: [{ id: 4000001, text: "Invalid credentials", type: "error" }],
    } as unknown as UiContainer

    expect(flowHasErrors(ui)).toBe(true)
  })

  test("should return true when node messages contain errors", () => {
    const ui = {
      action: "",
      method: "POST",
      nodes: [
        {
          messages: [{ id: 4000002, text: "Field is required", type: "error" }],
          attributes: {},
          type: "input",
          group: "default",
        },
      ],
      messages: [],
    } as unknown as UiContainer

    expect(flowHasErrors(ui)).toBe(true)
  })

  test("should return false when no error messages exist", () => {
    const ui = {
      action: "",
      method: "POST",
      nodes: [
        {
          messages: [],
          attributes: {},
          type: "input",
          group: "default",
        },
      ],
      messages: [],
    } as unknown as UiContainer

    expect(flowHasErrors(ui)).toBe(false)
  })

  test("should return false when messages are only info type", () => {
    const ui = {
      action: "",
      method: "POST",
      nodes: [
        {
          messages: [{ id: 1010001, text: "Enter your code", type: "info" }],
          attributes: {},
          type: "input",
          group: "default",
        },
      ],
      messages: [{ id: 1010002, text: "Check your email", type: "info" }],
    } as unknown as UiContainer

    expect(flowHasErrors(ui)).toBe(false)
  })

  test("should return false when messages are undefined", () => {
    const ui = {
      action: "",
      method: "POST",
      nodes: [
        {
          messages: [],
          attributes: {},
          type: "input",
          group: "default",
        },
      ],
    } as unknown as UiContainer

    expect(flowHasErrors(ui)).toBe(false)
  })
})
