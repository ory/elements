// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeInputAttributesTypeEnum,
  UiNodeTextAttributes,
} from "@ory/client-fetch"

import { getConsentNodeKey, isFooterNode } from "./card-consent"

describe("getConsentNodeKey", () => {
  it("should return name_value for input nodes with value", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "grant_scope",
        type: UiNodeInputAttributesTypeEnum.Checkbox,
        value: "openid",
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(getConsentNodeKey(node)).toBe("grant_scope_openid")
  })

  it("should return name for input nodes without value", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "remember",
        type: UiNodeInputAttributesTypeEnum.Checkbox,
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(getConsentNodeKey(node)).toBe("remember")
  })

  it("should return name for input nodes with null value", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "remember",
        type: UiNodeInputAttributesTypeEnum.Checkbox,
        value: null as unknown as string,
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(getConsentNodeKey(node)).toBe("remember")
  })

  it("should handle numeric values", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "grant_scope",
        type: UiNodeInputAttributesTypeEnum.Checkbox,
        value: 123 as unknown as string,
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(getConsentNodeKey(node)).toBe("grant_scope_123")
  })

  it("should use getNodeId for non-input nodes", () => {
    const node: UiNode = {
      type: "text",
      group: "oauth2_consent",
      attributes: {
        node_type: "text",
        id: "text-node-1",
        text: { id: 1, text: "Some text", type: "info" },
      } as UiNodeTextAttributes,
      messages: [],
      meta: {},
    }

    // getNodeId returns the id for text nodes
    expect(getConsentNodeKey(node)).toBe("text-node-1")
  })
})

describe("isFooterNode", () => {
  it("should return true for remember checkbox", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "remember",
        type: UiNodeInputAttributesTypeEnum.Checkbox,
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(isFooterNode(node)).toBe(true)
  })

  it("should return true for submit buttons", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "action",
        type: UiNodeInputAttributesTypeEnum.Submit,
        value: "accept",
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(isFooterNode(node)).toBe(true)
  })

  it("should return false for grant_scope checkboxes", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "grant_scope",
        type: UiNodeInputAttributesTypeEnum.Checkbox,
        value: "openid",
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(isFooterNode(node)).toBe(false)
  })

  it("should return false for hidden inputs", () => {
    const node: UiNode = {
      type: "input",
      group: "oauth2_consent",
      attributes: {
        node_type: "input",
        name: "consent_challenge",
        type: UiNodeInputAttributesTypeEnum.Hidden,
        value: "challenge-123",
        disabled: false,
      },
      messages: [],
      meta: {},
    }

    expect(isFooterNode(node)).toBe(false)
  })

  it("should return false for non-input nodes", () => {
    const node: UiNode = {
      type: "text",
      group: "oauth2_consent",
      attributes: {
        node_type: "text",
        id: "text-node-1",
        text: { id: 1, text: "Some text", type: "info" },
      } as UiNodeTextAttributes,
      messages: [],
      meta: {},
    }

    expect(isFooterNode(node)).toBe(false)
  })
})
