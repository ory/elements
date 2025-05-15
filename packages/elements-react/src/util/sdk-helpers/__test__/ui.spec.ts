// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// ui.test.ts
import {
  getNodeLabel,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeDivAttributes,
  isUiNodeTextAttributes,
  isUiNodeScriptAttributes,
  getNodeId,
  getNodeInputType,
} from "../ui"
import { UiNode } from "@ory/client-fetch"

describe("getNodeLabel", () => {
  it("should return label from anchor attributes", () => {
    const node = {
      attributes: {
        node_type: "a",
        title: { text: "Anchor Title", id: 1 },
        href: "#",
      },
      meta: {},
    } as UiNode

    expect(getNodeLabel(node)).toEqual({ text: "Anchor Title", id: 1 })
  })

  it("should return meta.label from image attributes", () => {
    const node = {
      attributes: {
        node_type: "img",
        src: "image.jpg",
      },
      meta: {
        label: { text: "Image Label", id: 2 },
      },
    } as UiNode

    expect(getNodeLabel(node)).toEqual({ text: "Image Label", id: 2 })
  })

  it("should return label from input attributes when available", () => {
    const node = {
      attributes: {
        node_type: "input",
        name: "username",
        label: { text: "Username", id: 3 },
      },
      meta: {
        label: { text: "Meta Label", id: 4 },
      },
    } as UiNode

    expect(getNodeLabel(node)).toEqual({ text: "Username", id: 3 })
  })

  it("should return meta.label when input has no label", () => {
    const node = {
      attributes: {
        node_type: "input",
        name: "username",
      },
      meta: {
        label: { text: "Meta Label", id: 4 },
      },
    } as UiNode

    expect(getNodeLabel(node)).toEqual({ text: "Meta Label", id: 4 })
  })

  it("should return undefined when no label is found", () => {
    const node = {
      attributes: {
        node_type: "input",
        name: "username",
      },
      meta: {},
    } as UiNode

    expect(getNodeLabel(node)).toBeUndefined()
  })
})

describe("Node attribute type guards", () => {
  it("should identify anchor attributes", () => {
    const attrs = { node_type: "a", href: "#" }
    expect(isUiNodeAnchorAttributes(attrs)).toBe(true)
    expect(isUiNodeImageAttributes(attrs)).toBe(false)
    expect(isUiNodeInputAttributes(attrs)).toBe(false)
  })

  it("should identify image attributes", () => {
    const attrs = { node_type: "img", src: "image.jpg" }
    expect(isUiNodeImageAttributes(attrs)).toBe(true)
    expect(isUiNodeAnchorAttributes(attrs)).toBe(false)
    expect(isUiNodeInputAttributes(attrs)).toBe(false)
  })

  it("should identify input attributes", () => {
    const attrs = { node_type: "input", name: "username" }
    expect(isUiNodeInputAttributes(attrs)).toBe(true)
    expect(isUiNodeAnchorAttributes(attrs)).toBe(false)
    expect(isUiNodeImageAttributes(attrs)).toBe(false)
  })

  it("should identify div attributes", () => {
    const attrs = { node_type: "div" }
    expect(isUiNodeDivAttributes(attrs)).toBe(true)
    expect(isUiNodeInputAttributes(attrs)).toBe(false)
  })

  it("should identify text attributes", () => {
    const attrs = { node_type: "text", text: "Some text" }
    expect(isUiNodeTextAttributes(attrs)).toBe(true)
    expect(isUiNodeDivAttributes(attrs)).toBe(false)
  })

  it("should identify script attributes", () => {
    const attrs = { node_type: "script", src: "script.js" }
    expect(isUiNodeScriptAttributes(attrs)).toBe(true)
    expect(isUiNodeTextAttributes(attrs)).toBe(false)
  })
})

describe("getNodeId", () => {
  it("should return name for input attributes", () => {
    const node = {
      attributes: {
        node_type: "input",
        name: "username",
      },
    } as UiNode

    expect(getNodeId(node)).toBe("username")
  })

  it("should return id for non-input attributes", () => {
    const node = {
      attributes: {
        node_type: "a",
        id: "login-link",
      },
    } as UiNode

    expect(getNodeId(node)).toBe("login-link")
  })
})

describe("getNodeInputType", () => {
  it("should return the type when present", () => {
    expect(getNodeInputType({ type: "password" })).toBe("password")
    expect(getNodeInputType({ type: "email" })).toBe("email")
    expect(getNodeInputType({ type: "text" })).toBe("text")
  })

  it("should return empty string when type is not present", () => {
    expect(getNodeInputType({})).toBe("")
    expect(getNodeInputType({ other: "value" })).toBe("")
  })

  it("should return empty string when type is not a string", () => {
    expect(getNodeInputType({ type: 123 })).toBe("")
    expect(getNodeInputType({ type: null })).toBe("")
    expect(getNodeInputType({ type: undefined })).toBe("")
  })
})
