// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { OryFlowContainer } from "../../util"
import {
  computeDefaultValues,
  getLoginHint,
  resolveLoginHint,
  unrollTrait,
} from "./form-helpers"

function flowContainer(
  flowType: FlowType,
  {
    requestUrl,
    oidcLoginHint,
  }: { requestUrl?: string; oidcLoginHint?: string } = {},
): OryFlowContainer {
  return {
    flowType,
    flow: {
      ui: { nodes: [] },
      request_url: requestUrl,
      oauth2_login_request:
        oidcLoginHint !== undefined
          ? { oidc_context: { login_hint: oidcLoginHint } }
          : undefined,
    },
  } as unknown as OryFlowContainer
}

function inputNode(name: string, value?: unknown, type = "text"): UiNode {
  return {
    type: "input",
    group: UiNodeGroupEnum.Default,
    messages: [],
    meta: {},
    attributes: {
      node_type: "input",
      name,
      type,
      value,
      disabled: false,
    } as UiNodeInputAttributes,
  } as UiNode
}

describe("unrollTrait", () => {
  type UnrollTrait<
    T extends string,
    V,
  > = T extends `${infer Head}.${infer Tail}`
    ? { [K in Head]: UnrollTrait<Tail, V> }
    : { [K in T]: V }

  test("should create a nested structure for a single input", () => {
    const input = { name: "a.b.c", value: 42 }
    const expected = { a: { b: { c: 42 } } }
    const result = unrollTrait(input)
    expect(result).toEqual(expected)
  })

  test("should merge with an existing structure", () => {
    const input: { name: string; value: number | string | object } = {
      name: "a.b.c",
      value: 42,
    }
    const output = { a: { b: { d: "existing" } } }
    const expected = { a: { b: { c: 42, d: "existing" } } }
    const result = unrollTrait(input, output)
    expect(result).toEqual(expected)
  })

  test("should handle single-level keys", () => {
    const input = { name: "key", value: "value" }
    const expected = { key: "value" }
    const result = unrollTrait(input)
    expect(result).toEqual(expected)
  })

  test("should handle empty output object", () => {
    const input = { name: "x.y.z", value: "value" }
    const expected = { x: { y: { z: "value" } } }
    const result = unrollTrait(input, {})
    expect(result).toEqual(expected)
  })

  test("should return undefined if the name is empty", () => {
    const input = { name: "", value: "value" }
    const result = unrollTrait(input)
    expect(result).toStrictEqual({})
  })

  test("should handle input with overlapping keys", () => {
    const input1 = { name: "a.b.c", value: 1 }
    const input2 = { name: "a.b.d", value: 2 }
    const output: Partial<UnrollTrait<string, unknown>> = {}
    unrollTrait(input1, output)
    unrollTrait(input2, output)

    const expected = { a: { b: { c: 1, d: 2 } } }
    expect(output).toEqual(expected)
  })

  test("should not modify the output object for disjoint keys", () => {
    const input1 = { name: "p.q", value: 100 }
    const input2 = { name: "x.y.z", value: 200 }
    const output: Partial<UnrollTrait<string, unknown>> = {}
    unrollTrait(input1, output)
    unrollTrait(input2, output)

    const expected = { p: { q: 100 }, x: { y: { z: 200 } } }
    expect(output).toEqual(expected)
  })
})

describe("computeDefaultValues login_hint pre-fill", () => {
  test("should seed an empty identifier field with the login hint", () => {
    const flow = { ui: { nodes: [inputNode("identifier", "")] } }
    const result = computeDefaultValues(flow, "jane@example.com")
    expect(result.identifier).toBe("jane@example.com")
  })

  test("should seed an empty traits.email field with the login hint", () => {
    const flow = { ui: { nodes: [inputNode("traits.email", "")] } }
    const result = computeDefaultValues(flow, "jane@example.com")
    expect(result.traits).toEqual({ email: "jane@example.com" })
  })

  test("should seed only the most-preferred empty field when several are present", () => {
    const flow = {
      ui: {
        nodes: [inputNode("identifier", ""), inputNode("traits.email", "")],
      },
    }
    const result = computeDefaultValues(flow, "jane@example.com")
    expect(result.identifier).toBe("jane@example.com")
    // The less-preferred field keeps its computed default and is not seeded.
    expect(result.traits).toEqual({ email: "" })
  })

  test("should fall through to the next preference when the preferred field is filled", () => {
    const flow = {
      ui: {
        nodes: [
          inputNode("identifier", "typed@example.com"),
          inputNode("traits.email", ""),
        ],
      },
    }
    const result = computeDefaultValues(flow, "hint@example.com")
    expect(result.identifier).toBe("typed@example.com")
    expect(result.traits).toEqual({ email: "hint@example.com" })
  })

  test("should not overwrite a non-empty identifier field", () => {
    const flow = {
      ui: { nodes: [inputNode("identifier", "typed@example.com")] },
    }
    const result = computeDefaultValues(flow, "hint@example.com")
    expect(result.identifier).toBe("typed@example.com")
  })

  test("should trim surrounding whitespace from the hint", () => {
    const flow = { ui: { nodes: [inputNode("identifier", "")] } }
    const result = computeDefaultValues(flow, "  jane@example.com  ")
    expect(result.identifier).toBe("jane@example.com")
  })

  test("should be a no-op when the hint is undefined", () => {
    const flow = { ui: { nodes: [inputNode("identifier", "")] } }
    const result = computeDefaultValues(flow, undefined)
    expect(result.identifier).toBe("")
  })

  test("should be a no-op when the hint is whitespace only", () => {
    const flow = { ui: { nodes: [inputNode("identifier", "")] } }
    const result = computeDefaultValues(flow, "   ")
    expect(result.identifier).toBe("")
  })

  test("should be a no-op when no identifier or email node is present", () => {
    const flow = { ui: { nodes: [inputNode("password", "", "password")] } }
    const result = computeDefaultValues(flow, "jane@example.com")
    expect(result).not.toHaveProperty("identifier")
    expect(result).not.toHaveProperty("traits")
  })
})

describe("getLoginHint", () => {
  test("should extract the login_hint query parameter", () => {
    expect(getLoginHint("?login_hint=jane@example.com")).toBe(
      "jane@example.com",
    )
  })

  test("should work without a leading question mark", () => {
    expect(getLoginHint("login_hint=jane@example.com")).toBe("jane@example.com")
  })

  test("should decode URL-encoded values", () => {
    expect(getLoginHint("?login_hint=jane%40example.com")).toBe(
      "jane@example.com",
    )
  })

  test("should return undefined when the parameter is absent", () => {
    expect(getLoginHint("?return_to=/foo")).toBeUndefined()
  })

  test("should return undefined for an empty search string", () => {
    expect(getLoginHint("")).toBeUndefined()
  })

  test("should return undefined for a whitespace-only value", () => {
    expect(getLoginHint("?login_hint=%20%20")).toBeUndefined()
  })

  test("should trim surrounding whitespace", () => {
    expect(getLoginHint("?login_hint=%20jane@example.com%20")).toBe(
      "jane@example.com",
    )
  })
})

describe("resolveLoginHint", () => {
  test("should return the hint from the flow's request_url", () => {
    const container = flowContainer(FlowType.Login, {
      requestUrl:
        "https://ory.example/self-service/login/browser?login_hint=url@example.com",
    })
    expect(resolveLoginHint(container)).toBe("url@example.com")
  })

  test("should decode a URL-encoded hint in the request_url", () => {
    const container = flowContainer(FlowType.Login, {
      requestUrl:
        "https://ory.example/self-service/login/browser?login_hint=url%40example.com",
    })
    expect(resolveLoginHint(container)).toBe("url@example.com")
  })

  test("should prefer the request_url hint over the oidc_context hint", () => {
    const container = flowContainer(FlowType.Login, {
      requestUrl:
        "https://ory.example/self-service/login/browser?login_hint=url@example.com",
      oidcLoginHint: "oidc@example.com",
    })
    expect(resolveLoginHint(container)).toBe("url@example.com")
  })

  test("should fall back to the oidc_context hint for a login flow", () => {
    const container = flowContainer(FlowType.Login, {
      requestUrl: "https://ory.example/self-service/login/browser",
      oidcLoginHint: "oidc@example.com",
    })
    expect(resolveLoginHint(container)).toBe("oidc@example.com")
  })

  test("should fall back to the oidc_context hint for a registration flow", () => {
    const container = flowContainer(FlowType.Registration, {
      requestUrl: "https://ory.example/self-service/registration/browser",
      oidcLoginHint: "oidc@example.com",
    })
    expect(resolveLoginHint(container)).toBe("oidc@example.com")
  })

  test("should ignore hints on non-login/registration flows", () => {
    const container = flowContainer(FlowType.Recovery, {
      requestUrl:
        "https://ory.example/self-service/recovery/browser?login_hint=url@example.com",
      oidcLoginHint: "oidc@example.com",
    })
    expect(resolveLoginHint(container)).toBeUndefined()
  })

  test("should trim a whitespace-only oidc_context hint to undefined", () => {
    const container = flowContainer(FlowType.Login, { oidcLoginHint: "   " })
    expect(resolveLoginHint(container)).toBeUndefined()
  })

  test("should return undefined when the request_url has no query string", () => {
    const container = flowContainer(FlowType.Login, {
      requestUrl: "https://ory.example/self-service/login/browser",
    })
    expect(resolveLoginHint(container)).toBeUndefined()
  })

  test("should return undefined when the request_url query has no hint", () => {
    const container = flowContainer(FlowType.Login, {
      requestUrl:
        "https://ory.example/self-service/login/browser?return_to=/foo",
    })
    expect(resolveLoginHint(container)).toBeUndefined()
  })

  test("should not throw when the flow has no request_url", () => {
    const container = flowContainer(FlowType.Login, {
      oidcLoginHint: "oidc@example.com",
    })
    expect(resolveLoginHint(container)).toBe("oidc@example.com")
  })
})
