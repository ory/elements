// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defaultNodeSorter } from "./defaultNodeSorter"
import { type UiNode, UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"

// Helper function to create mock UiNode objects for testing
const createMockNode = (
  group: string,
  type: string,
  inputType?: UiNodeInputAttributesTypeEnum,
): UiNode => ({
  group: group as any,
  type: type as any,
  attributes:
    type === "input"
      ? {
          node_type: "input",
          type: inputType || "text",
          name: `${group}-${inputType || "text"}`,
          required: false,
          disabled: false,
          autocomplete: "11184809",
        }
      : ({
          node_type: type,
          id: `${group}-${type}`,
        } as any),
  messages: [],
  meta: {
    label: undefined,
  },
})

// Helper to extract sortable properties for snapshot comparison
const extractNodeInfo = (node: UiNode) => ({
  group: node.group,
  type: node.type,
  inputType: (node.attributes as any)?.type,
})

describe("defaultNodeSorter", () => {
  describe("slot ordering", () => {
    it("should place regular inputs before checkboxes", () => {
      const inputNode = createMockNode("default", "input", "text")
      const checkboxNode = createMockNode("default", "input", "checkbox")

      const result = defaultNodeSorter(inputNode, checkboxNode)
      expect(result).toEqual(-1)
    })

    it("should place checkboxes before captcha nodes", () => {
      const checkboxNode = createMockNode("default", "input", "checkbox")
      const captchaNode = createMockNode("captcha", "div")

      const result = defaultNodeSorter(checkboxNode, captchaNode)
      expect(result).toEqual(1)
    })

    it("should place captcha nodes before buttons", () => {
      const captchaNode = createMockNode("captcha", "div")
      const buttonNode = createMockNode("default", "input", "submit")

      const result = defaultNodeSorter(captchaNode, buttonNode)
      expect(result).toEqual(-3)
    })

    it("should place non-input nodes in the inputs slot", () => {
      const textNode = createMockNode("default", "text")
      const inputNode = createMockNode("default", "input", "text")

      const result = defaultNodeSorter(textNode, inputNode)
      expect(result).toEqual(0)
    })
  })

  describe("group ordering within the same slot", () => {
    it("should order groups according to defaultNodeOrder", () => {
      const oidcNode = createMockNode("oidc", "input", "text")
      const samlNode = createMockNode("saml", "input", "text")

      const result = defaultNodeSorter(oidcNode, samlNode)
      expect(result).toMatchSnapshot()
    })

    it("should order multiple groups correctly", () => {
      const nodes = [
        createMockNode("webauthn", "input", "text"),
        createMockNode("password", "input", "text"),
        createMockNode("default", "input", "text"),
        createMockNode("oidc", "input", "text"),
      ]

      const sorted = [...nodes].sort(defaultNodeSorter)
      expect(sorted.map(extractNodeInfo)).toMatchSnapshot()
    })
  })

  describe("unknown groups", () => {
    it("should place unknown groups after known groups", () => {
      const knownNode = createMockNode("password", "input", "text")
      const unknownNode = createMockNode("unknown_group", "input", "text")

      const result = defaultNodeSorter(knownNode, unknownNode)
      expect(result).toMatchSnapshot()
    })

    it("should maintain stability for multiple unknown groups", () => {
      const unknown1 = createMockNode("unknown1", "input", "text")
      const unknown2 = createMockNode("unknown2", "input", "text")

      const result = defaultNodeSorter(unknown1, unknown2)
      expect(result).toMatchSnapshot()
    })
  })

  describe("button types", () => {
    it("should place submit buttons in the buttons slot", () => {
      const inputNode = createMockNode("default", "input", "text")
      const submitNode = createMockNode("default", "input", "submit")

      const result = defaultNodeSorter(inputNode, submitNode)
      expect(result).toMatchSnapshot()
    })

    it("should place button type inputs in the buttons slot", () => {
      const inputNode = createMockNode("default", "input", "text")
      const buttonNode = createMockNode("default", "input", "button")

      const result = defaultNodeSorter(inputNode, buttonNode)
      expect(result).toMatchSnapshot()
    })
  })

  describe("checkbox handling", () => {
    it("should place checkboxes after regular inputs in the same group", () => {
      const textInput = createMockNode("default", "input", "text")
      const checkbox = createMockNode("default", "input", "checkbox")

      const result = defaultNodeSorter(textInput, checkbox)
      expect(result).toMatchSnapshot()
    })

    it("should order checkboxes by group when in the same slot", () => {
      const passwordCheckbox = createMockNode("password", "input", "checkbox")
      const defaultCheckbox = createMockNode("default", "input", "checkbox")

      const result = defaultNodeSorter(defaultCheckbox, passwordCheckbox)
      expect(result).toMatchSnapshot()
    })
  })

  describe("captcha group handling", () => {
    it("should place captcha group nodes in the captcha slot regardless of node type", () => {
      const captchaDiv = createMockNode("captcha", "div")
      const buttonNode = createMockNode("default", "input", "submit")

      const result = defaultNodeSorter(captchaDiv, buttonNode)
      expect(result).toMatchSnapshot()
    })
  })

  describe("complex sorting scenarios", () => {
    it("should correctly sort a mixed array of nodes", () => {
      const nodes = [
        createMockNode("password", "input", "submit"),
        createMockNode("password", "input", "checkbox"),
        createMockNode("oidc", "input", "text"),
        createMockNode("default", "input", "checkbox"),
        createMockNode("captcha", "div"),
        createMockNode("default", "input", "text"),
        createMockNode("password", "input", "text"),
      ]

      const sorted = [...nodes].sort(defaultNodeSorter)
      expect(sorted.map(extractNodeInfo)).toMatchSnapshot()
    })

    it("should handle all default node orders", () => {
      const defaultOrder = [
        "oidc",
        "saml",
        "identifier_first",
        "default",
        "profile",
        "password",
        "captcha",
        "passkey",
        "code",
        "webauthn",
      ]

      const nodes = defaultOrder.map((group) =>
        createMockNode(group, "input", "text"),
      )

      const reversed = [...nodes].reverse()
      const sorted = reversed.sort(defaultNodeSorter)
      expect(sorted.map(extractNodeInfo)).toMatchSnapshot()
    })
  })

  describe("stability", () => {
    it("should maintain relative order of equal elements", () => {
      const node1 = { ...createMockNode("default", "input", "text"), id: 1 }
      const node2 = { ...createMockNode("default", "input", "text"), id: 2 }
      const node3 = { ...createMockNode("default", "input", "text"), id: 3 }

      const nodes = [node3, node1, node2]
      const sorted = [...nodes].sort(defaultNodeSorter)

      expect(
        sorted.map((n) => ({ ...extractNodeInfo(n), id: n.id })),
      ).toMatchSnapshot()
    })
  })

  describe("registration with boolean const:true (ToS checkbox)", () => {
    it("should place profile text inputs before profile checkboxes", () => {
      const emailInput = createMockNode("profile", "input", "email")
      const nameInput = createMockNode("profile", "input", "text")
      const tosCheckbox = createMockNode("profile", "input", "checkbox")

      const nodes = [tosCheckbox, emailInput, nameInput]
      const sorted = [...nodes].sort(defaultNodeSorter)

      expect(sorted.map(extractNodeInfo)).toEqual([
        { group: "profile", type: "input", inputType: "email" },
        { group: "profile", type: "input", inputType: "text" },
        { group: "profile", type: "input", inputType: "checkbox" },
      ])
    })

    it("should always place inputs before checkboxes before buttons regardless of initial order", () => {
      const emailInput = createMockNode("profile", "input", "email")
      const tosCheckbox = createMockNode("profile", "input", "checkbox")
      const submitButton = createMockNode("password", "input", "submit")

      // Slots are: inputs (0), checkboxes (1), buttons (3)
      // These three nodes are in different slots, so order is deterministic.
      const order1 = [tosCheckbox, emailInput, submitButton]
      const order2 = [submitButton, tosCheckbox, emailInput]
      const order3 = [emailInput, submitButton, tosCheckbox]

      const sorted1 = [...order1].sort(defaultNodeSorter).map(extractNodeInfo)
      const sorted2 = [...order2].sort(defaultNodeSorter).map(extractNodeInfo)
      const sorted3 = [...order3].sort(defaultNodeSorter).map(extractNodeInfo)

      expect(sorted1).toEqual(sorted2)
      expect(sorted2).toEqual(sorted3)
      // Verify the expected order: input < checkbox < button
      expect(sorted1).toEqual([
        { group: "profile", type: "input", inputType: "email" },
        { group: "profile", type: "input", inputType: "checkbox" },
        { group: "password", type: "input", inputType: "submit" },
      ])
    })
  })
})
