// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { findScreenSelectionButton, isDynamicText } from "./nodes"
import { UiNodeGroupEnum, type UiNode, type UiText } from "@ory/client-fetch"

describe("findScreenSelectionButton", () => {
  it("finds screen selection button", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: {
          name: "csrf_token",
          type: "hidden",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: {
          name: "screen",
          type: "submit",
          value: "previous",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: {
          name: "password",
          type: "password",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ]

    const result = findScreenSelectionButton(nodes)

    expect(result).toBeDefined()
    expect(result?.attributes.name).toBe("screen")
    expect(result?.attributes.type).toBe("submit")
  })

  it("returns undefined when no screen button exists", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: {
          name: "password",
          type: "password",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ]

    const result = findScreenSelectionButton(nodes)

    expect(result).toBeUndefined()
  })

  it("ignores non-submit buttons with screen name", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: {
          name: "screen",
          type: "hidden",
          value: "previous",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ]

    const result = findScreenSelectionButton(nodes)

    expect(result).toBeUndefined()
  })
})

describe("isDynamicText", () => {
  it("returns true for dynamic text with id 1070002 and name context", () => {
    const text: UiText = {
      id: 1070002,
      type: "info",
      text: "Password",
      context: { name: "password" },
    }

    expect(isDynamicText(text)).toBe(true)
  })

  it("returns false for text with wrong id", () => {
    const text: UiText = {
      id: 1070001,
      type: "info",
      text: "Password",
      context: { name: "password" },
    }

    expect(isDynamicText(text)).toBe(false)
  })

  it("returns false for text without context", () => {
    const text: UiText = {
      id: 1070002,
      type: "info",
      text: "Password",
    }

    expect(isDynamicText(text)).toBe(false)
  })

  it("returns false for text without name in context", () => {
    const text: UiText = {
      id: 1070002,
      type: "info",
      text: "Password",
      context: { other: "value" },
    }

    expect(isDynamicText(text)).toBe(false)
  })

  it("returns false for text with non-string name in context", () => {
    const text: UiText = {
      id: 1070002,
      type: "info",
      text: "Password",
      context: { name: 123 },
    }

    expect(isDynamicText(text)).toBe(false)
  })
})
