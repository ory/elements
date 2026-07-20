// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  nodesToAuthMethodGroups,
  getFunctionalNodes,
  hasSingleSignOnNodes,
  withoutSingleSignOnNodes,
  isNodeVisible,
  getNodeGroupsWithVisibleNodes,
  findNode,
  isUiNodeGroupEnum,
  triggerToFunction,
} from "./index"
import { UiNodeGroupEnum, type UiNode } from "@ory/client-fetch"

// Helper to create nodes
const createInputNode = (
  group: UiNodeGroupEnum,
  name: string,
  type: string = "text",
): UiNode => ({
  type: "input",
  group,
  attributes: { name, type, node_type: "input" },
  messages: [],
  meta: {},
})

const createScriptNode = (group: UiNodeGroupEnum, id: string): UiNode => ({
  type: "script",
  group,
  attributes: {
    id,
    src: "https://example.com/script.js",
    async: true,
    node_type: "script",
  },
  messages: [],
  meta: {},
})

describe("nodesToAuthMethodGroups", () => {
  it("extracts auth method groups from nodes", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
      createInputNode(UiNodeGroupEnum.Code, "code", "text"),
      createInputNode(UiNodeGroupEnum.Totp, "totp_code", "text"),
    ]

    const result = nodesToAuthMethodGroups(nodes)

    expect(result).toContain(UiNodeGroupEnum.Password)
    expect(result).toContain(UiNodeGroupEnum.Code)
    expect(result).toContain(UiNodeGroupEnum.Totp)
  })

  it("excludes default, identifier_first, profile, and captcha groups", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Default, "csrf_token", "hidden"),
      createInputNode(UiNodeGroupEnum.IdentifierFirst, "identifier", "text"),
      createInputNode(UiNodeGroupEnum.Profile, "traits.email", "email"),
      createInputNode(UiNodeGroupEnum.Captcha, "captcha", "text"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    const result = nodesToAuthMethodGroups(nodes)

    expect(result).not.toContain(UiNodeGroupEnum.Default)
    expect(result).not.toContain(UiNodeGroupEnum.IdentifierFirst)
    expect(result).not.toContain(UiNodeGroupEnum.Profile)
    expect(result).not.toContain(UiNodeGroupEnum.Captcha)
    expect(result).toContain(UiNodeGroupEnum.Password)
  })

  it("excludes script nodes", () => {
    const nodes: UiNode[] = [
      createScriptNode(UiNodeGroupEnum.Webauthn, "webauthn_script"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    const result = nodesToAuthMethodGroups(nodes)

    // Webauthn should not be included since it only has script node
    expect(result).not.toContain(UiNodeGroupEnum.Webauthn)
    expect(result).toContain(UiNodeGroupEnum.Password)
  })

  it("excludes specified auth methods", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
      createInputNode(UiNodeGroupEnum.Code, "code", "text"),
    ]

    const result = nodesToAuthMethodGroups(nodes, [UiNodeGroupEnum.Password])

    expect(result).not.toContain(UiNodeGroupEnum.Password)
    expect(result).toContain(UiNodeGroupEnum.Code)
  })

  it("returns empty array for nodes with only excluded groups", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Default, "csrf_token", "hidden"),
      createInputNode(UiNodeGroupEnum.Profile, "traits.email", "email"),
    ]

    const result = nodesToAuthMethodGroups(nodes)

    expect(result).toHaveLength(0)
  })
})

describe("getFunctionalNodes", () => {
  it("returns nodes from default, identifier_first, profile, and captcha groups", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Default, "csrf_token", "hidden"),
      createInputNode(UiNodeGroupEnum.IdentifierFirst, "identifier", "text"),
      createInputNode(UiNodeGroupEnum.Profile, "traits.email", "email"),
      createInputNode(UiNodeGroupEnum.Captcha, "captcha", "text"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    const result = getFunctionalNodes(nodes)

    expect(result).toHaveLength(4)
    expect(
      result.every((n) =>
        [
          UiNodeGroupEnum.Default,
          UiNodeGroupEnum.IdentifierFirst,
          UiNodeGroupEnum.Profile,
          UiNodeGroupEnum.Captcha,
        ].includes(n.group),
      ),
    ).toBe(true)
  })

  it("excludes credential-related groups", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
      createInputNode(UiNodeGroupEnum.Totp, "totp_code", "text"),
      createInputNode(UiNodeGroupEnum.Webauthn, "webauthn", "text"),
    ]

    const result = getFunctionalNodes(nodes)

    expect(result).toHaveLength(0)
  })
})

describe("hasSingleSignOnNodes", () => {
  it("returns true when OIDC nodes are present", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Oidc, "provider", "submit"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    expect(hasSingleSignOnNodes(nodes)).toBe(true)
  })

  it("returns true when SAML nodes are present", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Saml, "provider", "submit"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    expect(hasSingleSignOnNodes(nodes)).toBe(true)
  })

  it("returns false when no SSO nodes are present", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
      createInputNode(UiNodeGroupEnum.Code, "code", "text"),
    ]

    expect(hasSingleSignOnNodes(nodes)).toBe(false)
  })
})

describe("withoutSingleSignOnNodes", () => {
  it("filters out OIDC and SAML nodes", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Oidc, "provider_google", "submit"),
      createInputNode(UiNodeGroupEnum.Saml, "provider_okta", "submit"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    const result = withoutSingleSignOnNodes(nodes)

    expect(result).toHaveLength(1)
    expect(result[0].group).toBe(UiNodeGroupEnum.Password)
  })

  it("returns all nodes when no SSO nodes present", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
      createInputNode(UiNodeGroupEnum.Code, "code", "text"),
    ]

    const result = withoutSingleSignOnNodes(nodes)

    expect(result).toHaveLength(2)
  })
})

describe("isNodeVisible", () => {
  it("returns false for script nodes", () => {
    const node = createScriptNode(UiNodeGroupEnum.Webauthn, "webauthn_script")
    expect(isNodeVisible(node)).toBe(false)
  })

  it("returns false for hidden input nodes", () => {
    const node = createInputNode(
      UiNodeGroupEnum.Default,
      "csrf_token",
      "hidden",
    )
    expect(isNodeVisible(node)).toBe(false)
  })

  it("returns true for visible input nodes", () => {
    const node = createInputNode(
      UiNodeGroupEnum.Password,
      "password",
      "password",
    )
    expect(isNodeVisible(node)).toBe(true)
  })

  it("returns true for text nodes", () => {
    const node: UiNode = {
      type: "text",
      group: UiNodeGroupEnum.Default,
      attributes: {
        id: "message",
        text: { id: 1, type: "info", text: "Message" },
        node_type: "text",
      },
      messages: [],
      meta: {},
    }
    expect(isNodeVisible(node)).toBe(true)
  })
})

describe("getNodeGroupsWithVisibleNodes", () => {
  it("groups nodes and excludes groups with only hidden nodes", () => {
    const nodes: UiNode[] = [
      createInputNode(UiNodeGroupEnum.Default, "csrf_token", "hidden"),
      createInputNode(UiNodeGroupEnum.Default, "flow", "hidden"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
      createInputNode(UiNodeGroupEnum.Password, "method", "hidden"),
    ]

    const result = getNodeGroupsWithVisibleNodes(nodes)

    // Default group should be excluded (all hidden)
    expect(result[UiNodeGroupEnum.Default]).toBeUndefined()
    // Password group should be included (has visible node)
    expect(result[UiNodeGroupEnum.Password]).toBeDefined()
    expect(result[UiNodeGroupEnum.Password]?.length).toBe(2)
  })

  it("excludes groups with only script nodes", () => {
    const nodes: UiNode[] = [
      createScriptNode(UiNodeGroupEnum.Webauthn, "webauthn_script"),
      createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    ]

    const result = getNodeGroupsWithVisibleNodes(nodes)

    expect(result[UiNodeGroupEnum.Webauthn]).toBeUndefined()
    expect(result[UiNodeGroupEnum.Password]).toBeDefined()
  })
})

describe("findNode", () => {
  const nodes: UiNode[] = [
    createInputNode(UiNodeGroupEnum.Default, "csrf_token", "hidden"),
    createInputNode(UiNodeGroupEnum.Password, "password", "password"),
    createInputNode(UiNodeGroupEnum.Password, "method", "submit"),
    createScriptNode(UiNodeGroupEnum.Webauthn, "webauthn_script"),
  ]

  it("finds node by name", () => {
    const result = findNode(nodes, { node_type: "input", name: "password" })
    expect(result).toBeDefined()
    expect(result?.attributes.name).toBe("password")
  })

  it("finds node by type", () => {
    const result = findNode(nodes, { node_type: "input", type: "submit" })
    expect(result).toBeDefined()
    expect(result?.attributes.name).toBe("method")
  })

  it("finds node by group", () => {
    const result = findNode(nodes, {
      node_type: "input",
      group: UiNodeGroupEnum.Default,
    })
    expect(result).toBeDefined()
    expect(result?.attributes.name).toBe("csrf_token")
  })

  it("finds script node by id", () => {
    const result = findNode(nodes, {
      node_type: "script",
      id: "webauthn_script",
    })
    expect(result).toBeDefined()
    expect(result?.attributes.id).toBe("webauthn_script")
  })

  it("returns undefined when no match found", () => {
    const result = findNode(nodes, { node_type: "input", name: "nonexistent" })
    expect(result).toBeUndefined()
  })

  it("finds node by regex pattern", () => {
    const result = findNode(nodes, { node_type: "input", name: /pass.*/ })
    expect(result).toBeDefined()
    expect(result?.attributes.name).toBe("password")
  })
})

describe("isUiNodeGroupEnum", () => {
  it("returns true for valid group enum values", () => {
    expect(isUiNodeGroupEnum("password")).toBe(true)
    expect(isUiNodeGroupEnum("oidc")).toBe(true)
    expect(isUiNodeGroupEnum("default")).toBe(true)
    expect(isUiNodeGroupEnum("totp")).toBe(true)
  })

  it("returns false for invalid group values", () => {
    expect(isUiNodeGroupEnum("invalid")).toBe(false)
    expect(isUiNodeGroupEnum("")).toBe(false)
    expect(isUiNodeGroupEnum("PASSWORD")).toBe(false)
  })
})

describe("triggerToFunction", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns undefined when window is undefined", () => {
    vi.stubGlobal("window", undefined)
    const result = triggerToFunction("__oryWebAuthnLogin" as never)
    expect(result).toBeUndefined()
  })

  it("returns undefined when function is not on window", () => {
    const result = triggerToFunction("__oryWebAuthnLogin" as never)
    expect(result).toBeUndefined()
  })

  it("returns undefined when window property is not a function", () => {
    vi.stubGlobal("window", { __oryWebAuthnLogin: "not a function" })
    const result = triggerToFunction("__oryWebAuthnLogin" as never)
    expect(result).toBeUndefined()
  })

  it("returns function when found on window", () => {
    const mockFn = vi.fn()
    vi.stubGlobal("window", { __oryWebAuthnLogin: mockFn })
    const result = triggerToFunction("__oryWebAuthnLogin" as never)
    expect(result).toBe(mockFn)
  })
})
