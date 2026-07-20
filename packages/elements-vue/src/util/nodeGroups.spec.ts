// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { getNodeGroups, getScriptNodes } from "./nodeGroups"
import { UiNodeGroupEnum, type UiNode } from "@ory/client-fetch"

describe("getNodeGroups", () => {
  it("groups nodes by their group", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: { name: "csrf_token", type: "hidden", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "password", type: "password", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "identifier", type: "text", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Oidc,
        attributes: {
          name: "provider",
          value: "google",
          type: "submit",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ]

    const result = getNodeGroups(nodes)

    expect(result.groups[UiNodeGroupEnum.Default]).toHaveLength(1)
    expect(result.groups[UiNodeGroupEnum.Password]).toHaveLength(2)
    expect(result.groups[UiNodeGroupEnum.Oidc]).toHaveLength(1)
    expect(result.entries).toHaveLength(3)
  })

  it("omits script nodes when option is set", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "password", type: "password", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "script",
        group: UiNodeGroupEnum.Webauthn,
        attributes: {
          id: "webauthn_script",
          src: "https://example.com/script.js",
          async: true,
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
    ]

    const result = getNodeGroups(nodes, { omit: ["script"] })

    // Script-only group should be excluded from entries
    expect(
      result.entries.find(([group]) => group === UiNodeGroupEnum.Webauthn),
    ).toBeUndefined()
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0][0]).toBe(UiNodeGroupEnum.Password)
  })

  it("omits hidden input nodes when option is set", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: { name: "csrf_token", type: "hidden", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: { name: "flow", type: "hidden", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "password", type: "password", node_type: "input" },
        messages: [],
        meta: {},
      },
    ]

    const result = getNodeGroups(nodes, { omit: ["input_hidden"] })

    // Default group (all hidden) should be excluded
    expect(
      result.entries.find(([group]) => group === UiNodeGroupEnum.Default),
    ).toBeUndefined()
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0][0]).toBe(UiNodeGroupEnum.Password)
  })

  it("keeps groups with mixed hidden and visible nodes", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: {
          name: "method",
          type: "hidden",
          value: "password",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "password", type: "password", node_type: "input" },
        messages: [],
        meta: {},
      },
    ]

    const result = getNodeGroups(nodes, { omit: ["input_hidden"] })

    // Password group should be kept because it has a visible node
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0][0]).toBe(UiNodeGroupEnum.Password)
    // But both nodes should be in the group
    expect(result.groups[UiNodeGroupEnum.Password]).toHaveLength(2)
  })

  it("returns empty result for empty nodes array", () => {
    const result = getNodeGroups([])

    expect(result.groups).toEqual({})
    expect(result.entries).toHaveLength(0)
  })
})

describe("getScriptNodes", () => {
  it("returns only webauthn_script nodes", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "password", type: "password", node_type: "input" },
        messages: [],
        meta: {},
      },
      {
        type: "script",
        group: UiNodeGroupEnum.Webauthn,
        attributes: {
          id: "webauthn_script",
          src: "https://example.com/webauthn.js",
          async: true,
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
      {
        type: "script",
        group: UiNodeGroupEnum.Default,
        attributes: {
          id: "other_script",
          src: "https://example.com/other.js",
          async: true,
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
    ]

    const result = getScriptNodes(nodes)

    expect(result).toHaveLength(1)
    expect((result[0].attributes as { id: string }).id).toBe("webauthn_script")
  })

  it("returns empty array when no webauthn_script nodes exist", () => {
    const nodes: UiNode[] = [
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: { name: "password", type: "password", node_type: "input" },
        messages: [],
        meta: {},
      },
    ]

    const result = getScriptNodes(nodes)

    expect(result).toHaveLength(0)
  })
})
