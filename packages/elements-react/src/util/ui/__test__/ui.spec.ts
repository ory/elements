// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import allMethodsInitialForm from "./.fixtures/initial-form.json"
import omitHiddenInput from "./.fixtures/omit-hidden-input.json"

import { useNodesGroups } from ".."
import { UiNode, UiNodeTypeEnum } from "@ory/client-fetch"
import { renderHook } from "@testing-library/react"

import { UiNodeGroupEnum } from "@ory/client-fetch"
import {
  useFunctionalNodes,
  isUiNodeGroupEnum,
  hasSingleSignOnNodes,
  withoutSingleSignOnNodes,
  isNodeVisible,
  useNodeGroupsWithVisibleNodes,
} from ".."
import { UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"

describe("useFunctionalNodes", () => {
  test("returns only functional nodes", () => {
    const { result } = renderHook(() =>
      useFunctionalNodes(allMethodsInitialForm.ui.nodes as UiNode[]),
    )

    // Filter nodes that belong to functional groups
    const functionalGroups: Partial<UiNodeGroupEnum>[] = [
      UiNodeGroupEnum.Default,
      UiNodeGroupEnum.IdentifierFirst,
      UiNodeGroupEnum.Profile,
      UiNodeGroupEnum.Captcha,
    ]

    // Verify all returned nodes belong to functional groups
    expect(
      result.current.every((node: UiNode) =>
        functionalGroups.includes(node.group),
      ),
    ).toBe(true)

    // Verify no nodes from non-functional groups are included
    expect(
      result.current.some(
        (node) =>
          node.group === UiNodeGroupEnum.Password ||
          node.group === UiNodeGroupEnum.Oidc,
      ),
    ).toBe(false)
  })
})

describe("isUiNodeGroupEnum", () => {
  test("returns true for valid group enum values", () => {
    expect(isUiNodeGroupEnum("password")).toBe(true)
    expect(isUiNodeGroupEnum("oidc")).toBe(true)
    expect(isUiNodeGroupEnum("default")).toBe(true)
  })

  test("returns false for invalid group enum values", () => {
    expect(isUiNodeGroupEnum("invalidgroup")).toBe(false)
    expect(isUiNodeGroupEnum("")).toBe(false)
  })
})

describe("SSO node functions", () => {
  // Create a helper function to make SSO and non-SSO nodes for testing
  const createTestNode = (group: UiNodeGroupEnum): UiNode => ({
    type: "input",
    group,
    attributes: {
      name: "test",
      type: "text",
      value: "",
      required: false,
      disabled: false,
      node_type: "input",
    },
    messages: [],
    meta: {},
  })

  test("hasSingleSignOnNodes returns true when SSO nodes exist", () => {
    const nodes = [
      createTestNode(UiNodeGroupEnum.Password),
      createTestNode(UiNodeGroupEnum.Oidc),
    ]

    expect(hasSingleSignOnNodes(nodes)).toBe(true)

    const nodesWithSaml = [
      createTestNode(UiNodeGroupEnum.Password),
      createTestNode(UiNodeGroupEnum.Saml),
    ]

    expect(hasSingleSignOnNodes(nodesWithSaml)).toBe(true)
  })

  test("hasSingleSignOnNodes returns false when no SSO nodes exist", () => {
    const nodes = [
      createTestNode(UiNodeGroupEnum.Password),
      createTestNode(UiNodeGroupEnum.Default),
    ]

    expect(hasSingleSignOnNodes(nodes)).toBe(false)
  })

  test("withoutSingleSignOnNodes filters out SSO nodes", () => {
    const nodes = [
      createTestNode(UiNodeGroupEnum.Password),
      createTestNode(UiNodeGroupEnum.Oidc),
      createTestNode(UiNodeGroupEnum.Default),
      createTestNode(UiNodeGroupEnum.Saml),
    ]

    const filtered = withoutSingleSignOnNodes(nodes)

    expect(filtered).toHaveLength(2)
    expect(filtered.some((node) => node.group === UiNodeGroupEnum.Oidc)).toBe(
      false,
    )
    expect(filtered.some((node) => node.group === UiNodeGroupEnum.Saml)).toBe(
      false,
    )
    expect(
      filtered.some((node) => node.group === UiNodeGroupEnum.Password),
    ).toBe(true)
    expect(
      filtered.some((node) => node.group === UiNodeGroupEnum.Default),
    ).toBe(true)
  })
})

describe("isNodeVisible", () => {
  test("returns false for script nodes", () => {
    const scriptNode: UiNode = {
      type: UiNodeTypeEnum.Script,
      group: UiNodeGroupEnum.Default,
      attributes: {
        node_type: UiNodeTypeEnum.Script,
        src: "test.js",
        async: true,
        referrerpolicy: "no-referrer",
        id: "script",
        crossorigin: "",
        integrity: "",
        nonce: "",
        type: "script",
      },
      messages: [],
      meta: {},
    }

    expect(isNodeVisible(scriptNode)).toBe(false)
  })

  test("returns false for hidden input nodes", () => {
    const hiddenNode: UiNode = {
      type: "input",
      group: UiNodeGroupEnum.Default,
      attributes: {
        name: "hidden-field",
        type: "hidden",
        value: "hidden-value",
        required: false,
        disabled: false,
        node_type: "input",
      },
      messages: [],
      meta: {},
    }

    expect(isNodeVisible(hiddenNode)).toBe(false)
  })

  test("returns true for visible input nodes", () => {
    const visibleNode: UiNode = {
      type: "input",
      group: UiNodeGroupEnum.Default,
      attributes: {
        name: "visible-field",
        type: "text",
        value: "",
        required: false,
        disabled: false,
        node_type: "input",
      },
      messages: [],
      meta: {},
    }

    expect(isNodeVisible(visibleNode)).toBe(true)
  })
})

describe("useNodeGroupsWithVisibleNodes", () => {
  test("returns groups with at least one visible node", () => {
    // Create a mix of visible and invisible nodes
    const mixedNodes = [
      // Visible password node
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: {
          name: "password",
          type: "password",
          required: true,
          node_type: "input",
          disabled: false,
        },
        messages: [],
        meta: {},
      },
      // Hidden default node
      {
        type: "input",
        group: UiNodeGroupEnum.Default,
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "token123",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      // Script webauthn node
      {
        type: "input",
        group: UiNodeGroupEnum.Webauthn,
        attributes: {
          name: "webauthn-script",
          node_type: "script",
          src: "webauthn.js",
          async: true,
        },
        messages: [],
        meta: {},
      },
      // Visible oidc node
      {
        type: "input",
        group: UiNodeGroupEnum.Oidc,
        attributes: {
          name: "provider",
          type: "submit",
          value: "Google",
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ] as UiNode[]

    const { result } = renderHook(() =>
      useNodeGroupsWithVisibleNodes(mixedNodes),
    )

    // Password and OIDC should be visible, Default and Webauthn should not
    expect(result.current.password).toHaveLength(1)
    expect(result.current.oidc).toHaveLength(1)
    expect(result.current.default).toBeUndefined()
    expect(result.current.webauthn).toBeUndefined()
  })

  test("groups contain all nodes even if some are invisible", () => {
    const nodes = [
      // Visible password node
      {
        type: UiNodeTypeEnum.Input,
        group: UiNodeGroupEnum.Password,
        attributes: {
          name: "password",
          type: UiNodeInputAttributesTypeEnum.Password,
          required: true,
          disabled: false,
          node_type: UiNodeTypeEnum.Input,
        },
        messages: [],
        meta: {},
      },
      // Hidden password node
      {
        type: "input",
        group: UiNodeGroupEnum.Password,
        attributes: {
          name: "password_confirmation",
          type: UiNodeInputAttributesTypeEnum.Hidden,
          value: "",
          node_type: UiNodeTypeEnum.Input,
        },
        messages: [],
        meta: {},
      },
    ] as UiNode[]

    const { result } = renderHook(() => useNodeGroupsWithVisibleNodes(nodes))

    // Password group should contain both nodes
    expect(result.current.password).toBeDefined()
    expect(result.current.password).toHaveLength(2)
  })
})

describe("utils/ui", () => {
  test("useNodesGroups without omit", () => {
    const { result } = renderHook(() =>
      useNodesGroups(allMethodsInitialForm.ui.nodes as UiNode[]),
    )

    expect(result.current.groups.oidc).toHaveLength(2)
    expect(result.current.groups.default).toHaveLength(2)
    expect(result.current.groups.webauthn).toHaveLength(1)
    expect(result.current.groups.passkey).toHaveLength(3)
    expect(result.current.groups.password).toHaveLength(2)
    expect(result.current.groups.code).toHaveLength(1)
  })

  test("useNodesGroups with omit all", () => {
    const { result } = renderHook(() =>
      useNodesGroups(allMethodsInitialForm.ui.nodes as UiNode[], {
        omit: ["input_hidden", "script"],
      }),
    )

    expect(result.current.groups.oidc).toHaveLength(2)
    expect(result.current.groups.default).toHaveLength(2)
    expect(result.current.groups.webauthn).toBeUndefined()
    expect(result.current.groups.passkey).toHaveLength(3)
    expect(result.current.groups.password).toHaveLength(2)
    expect(result.current.groups.code).toHaveLength(1)
  })

  test("useNodesGroups with omit script", () => {
    const { result } = renderHook(() =>
      useNodesGroups(allMethodsInitialForm.ui.nodes as UiNode[], {
        omit: ["script"],
      }),
    )

    expect(result.current.groups.oidc).toHaveLength(2)
    expect(result.current.groups.default).toHaveLength(2)
    expect(result.current.groups.webauthn).toBeUndefined()
    expect(result.current.groups.passkey).toHaveLength(3)
    expect(result.current.groups.password).toHaveLength(2)
    expect(result.current.groups.code).toHaveLength(1)
  })

  test("useNodesGroups with omit hidden input fields", () => {
    const { result } = renderHook(() =>
      useNodesGroups(omitHiddenInput.ui.nodes as UiNode[], {
        omit: ["input_hidden"],
      }),
    )

    expect(result.current.groups.oidc).toHaveLength(2)
    expect(result.current.groups.default).toHaveLength(2)
    expect(result.current.groups.webauthn).toHaveLength(1)
    expect(result.current.groups.passkey).toBeUndefined()
    expect(result.current.groups.password).toHaveLength(2)
    expect(result.current.groups.code).toHaveLength(1)
  })
})
