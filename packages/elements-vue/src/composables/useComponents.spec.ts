// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import {
  provideComponents,
  useComponents,
  useNodeSorter,
  useGroupSorter,
  defaultNodeSorter,
  defaultGroupSorter,
  type OryFlowComponents,
} from "./useComponents"
import { UiNodeGroupEnum, type UiNode } from "@ory/client-fetch"

// Mock components for testing
const MockComponent = defineComponent({
  render() {
    return h("div", "Mock")
  },
})

const mockComponents: OryFlowComponents = {
  Node: {
    Button: MockComponent,
    SsoButton: MockComponent,
    Anchor: MockComponent,
    Input: MockComponent,
    CodeInput: MockComponent,
    Image: MockComponent,
    Label: MockComponent,
    Checkbox: MockComponent,
    Text: MockComponent,
    Captcha: MockComponent,
    ConsentScopeCheckbox: MockComponent,
  },
  Card: {
    Root: MockComponent,
    Footer: MockComponent,
    Header: MockComponent,
    Content: MockComponent,
    Logo: MockComponent,
    Divider: MockComponent,
    AuthMethodListContainer: MockComponent,
    AuthMethodListItem: MockComponent,
    SettingsSection: MockComponent,
    SettingsSectionContent: MockComponent,
    SettingsSectionFooter: MockComponent,
  },
  Form: {
    Root: MockComponent,
    SsoRoot: MockComponent,
    Group: MockComponent,
    SsoSettings: MockComponent,
    WebauthnSettings: MockComponent,
    PasskeySettings: MockComponent,
    TotpSettings: MockComponent,
    RecoveryCodesSettings: MockComponent,
  },
  Message: {
    Root: MockComponent,
    Content: MockComponent,
    Toast: MockComponent,
  },
  Page: {
    Header: MockComponent,
  },
}

describe("useComponents", () => {
  it("throws error when used outside provider", () => {
    const TestConsumer = defineComponent({
      setup() {
        useComponents()
      },
      render() {
        return h("div")
      },
    })

    expect(() => {
      mount(TestConsumer)
    }).toThrow(
      "useComponents must be used within a component that has called provideComponents",
    )
  })

  it("provides components to consumers", () => {
    let components: OryFlowComponents | undefined

    const TestConsumer = defineComponent({
      setup() {
        components = useComponents()
      },
      render() {
        return h("div")
      },
    })

    const Provider = defineComponent({
      setup() {
        provideComponents({ components: mockComponents })
      },
      render() {
        return h(TestConsumer)
      },
    })

    mount(Provider)

    expect(components).toBeDefined()
    expect(components?.Node.Button).toBe(MockComponent)
    expect(components?.Card.Root).toBe(MockComponent)
  })
})

describe("useNodeSorter", () => {
  it("throws error when used outside provider", () => {
    const TestConsumer = defineComponent({
      setup() {
        useNodeSorter()
      },
      render() {
        return h("div")
      },
    })

    expect(() => {
      mount(TestConsumer)
    }).toThrow(
      "useNodeSorter must be used within a component that has called provideComponents",
    )
  })

  it("returns the provided node sorter", () => {
    const customSorter = () => 0
    let sorter: ReturnType<typeof useNodeSorter> | undefined

    const TestConsumer = defineComponent({
      setup() {
        sorter = useNodeSorter()
      },
      render() {
        return h("div")
      },
    })

    const Provider = defineComponent({
      setup() {
        provideComponents({
          components: mockComponents,
          nodeSorter: customSorter,
        })
      },
      render() {
        return h(TestConsumer)
      },
    })

    mount(Provider)

    expect(sorter).toBe(customSorter)
  })

  it("returns default node sorter when not provided", () => {
    let sorter: ReturnType<typeof useNodeSorter> | undefined

    const TestConsumer = defineComponent({
      setup() {
        sorter = useNodeSorter()
      },
      render() {
        return h("div")
      },
    })

    const Provider = defineComponent({
      setup() {
        provideComponents({ components: mockComponents })
      },
      render() {
        return h(TestConsumer)
      },
    })

    mount(Provider)

    expect(sorter).toBe(defaultNodeSorter)
  })
})

describe("useGroupSorter", () => {
  it("throws error when used outside provider", () => {
    const TestConsumer = defineComponent({
      setup() {
        useGroupSorter()
      },
      render() {
        return h("div")
      },
    })

    expect(() => {
      mount(TestConsumer)
    }).toThrow(
      "useGroupSorter must be used within a component that has called provideComponents",
    )
  })
})

describe("defaultNodeSorter", () => {
  const createNode = (group: string, type: string = "text"): UiNode => ({
    type: "input",
    group: group as UiNodeGroupEnum,
    attributes: { name: "test", type, node_type: "input" },
    messages: [],
    meta: {},
  })

  it("sorts captcha before submit buttons", () => {
    const captcha = createNode("captcha", "text")
    const submit = createNode("password", "submit")

    expect(defaultNodeSorter(captcha, submit)).toBe(-1)
    expect(defaultNodeSorter(submit, captcha)).toBe(1)
  })

  it("sorts by default group order", () => {
    const oidc = createNode("oidc")
    const password = createNode("password")
    const code = createNode("code")

    // oidc comes before password in default order
    expect(defaultNodeSorter(oidc, password)).toBeLessThan(0)
    // password comes before code in default order
    expect(defaultNodeSorter(password, code)).toBeLessThan(0)
  })

  it("handles nodes with same group", () => {
    const node1 = createNode("password")
    const node2 = createNode("password")

    expect(defaultNodeSorter(node1, node2)).toBe(0)
  })

  it("handles unknown groups", () => {
    const known = createNode("password")
    const unknown = createNode("unknown_group")

    // Note: indexOf returns -1 for unknown groups, so unknown groups
    // actually sort before known groups in the current implementation
    // known (password) index = 5, unknown index = -1
    // Result: 5 - (-1) = 6 (positive, so known sorts after unknown)
    expect(defaultNodeSorter(known, unknown)).toBeGreaterThan(0)
    expect(defaultNodeSorter(unknown, known)).toBeLessThan(0)
  })
})

describe("defaultGroupSorter", () => {
  it("sorts groups by default order", () => {
    expect(
      defaultGroupSorter(UiNodeGroupEnum.Default, UiNodeGroupEnum.Password),
    ).toBeLessThan(0)
    expect(
      defaultGroupSorter(UiNodeGroupEnum.Password, UiNodeGroupEnum.Oidc),
    ).toBeLessThan(0)
    expect(
      defaultGroupSorter(UiNodeGroupEnum.Oidc, UiNodeGroupEnum.Code),
    ).toBeLessThan(0)
    expect(
      defaultGroupSorter(UiNodeGroupEnum.Code, UiNodeGroupEnum.Totp),
    ).toBeLessThan(0)
  })

  it("returns 0 for same groups", () => {
    expect(
      defaultGroupSorter(UiNodeGroupEnum.Password, UiNodeGroupEnum.Password),
    ).toBe(0)
  })

  it("handles comparison in reverse order", () => {
    expect(
      defaultGroupSorter(UiNodeGroupEnum.Totp, UiNodeGroupEnum.Default),
    ).toBeGreaterThan(0)
  })
})
