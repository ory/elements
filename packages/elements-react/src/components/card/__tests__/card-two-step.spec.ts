// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  filterZeroStepGroups,
  getFinalNodes,
  isChoosingMethod,
} from "../card-two-step.utils"
import { UiNode, UiNodeAttributes, UiNodeGroupEnum } from "@ory/client-fetch"

describe("CardTwoStep/utils", () => {
  describe("filterZeroStepGroups", () => {
    test("should filter out nodes with group Oidc", () => {
      const nodes: UiNode[] = [
        { group: UiNodeGroupEnum.Oidc } as UiNode,
        { group: UiNodeGroupEnum.Default } as UiNode,
      ]
      const result = filterZeroStepGroups(nodes)
      expect(result).toHaveLength(1)
      expect(result[0].group).toBe(UiNodeGroupEnum.Default)
    })
  })

  describe("isChoosingMethod", () => {
    test("should return true if a node has value 'profile:back'", () => {
      const uiNodes: UiNode[] = [
        {
          attributes: { value: "profile:back" } as UiNodeAttributes,
          group: UiNodeGroupEnum.Default,
        } as UiNode,
      ]
      expect(isChoosingMethod(uiNodes)).toBe(true)
    })

    test("should return true if a node is identifier first and hidden", () => {
      const uiNodes: UiNode[] = [
        {
          attributes: {
            name: "identifier",
            type: "hidden",
          } as UiNodeAttributes,
          group: UiNodeGroupEnum.IdentifierFirst,
        } as UiNode,
      ]
      expect(isChoosingMethod(uiNodes)).toBe(true)
    })

    test("should return false if no conditions are met", () => {
      const uiNodes: UiNode[] = [
        {
          attributes: { name: "other", type: "text" } as UiNodeAttributes,
          group: UiNodeGroupEnum.Default,
        } as UiNode,
      ]
      expect(isChoosingMethod(uiNodes)).toBe(false)
    })
  })

  describe("getFinalNodes", () => {
    test("should return hidden nodes from identifier_first and default groups, concatenated with selected nodes", () => {
      const uniqueGroups = {
        identifier_first: [
          {
            attributes: { type: "hidden" } as UiNodeAttributes,
          } as UiNode,
        ],
        default: [
          {
            attributes: { type: "hidden" } as UiNodeAttributes,
          } as UiNode,
        ],
      }
      const selectedGroup = UiNodeGroupEnum.Default
      const result = getFinalNodes(uniqueGroups, selectedGroup)
      expect(result).toHaveLength(3)
    })

    test("should return only hidden nodes if no group is selected", () => {
      const uniqueGroups = {
        identifier_first: [
          {
            attributes: { type: "hidden" } as UiNodeAttributes,
          } as UiNode,
        ],
        default: [
          {
            attributes: { type: "hidden" } as UiNodeAttributes,
          } as UiNode,
        ],
      }
      const result = getFinalNodes(uniqueGroups, undefined)
      expect(result).toHaveLength(2)
    })

    test("should return an empty array if no hidden nodes are found and no group is selected", () => {
      const uniqueGroups = {
        identifier_first: [
          {
            attributes: { type: "text" } as UiNodeAttributes,
          } as UiNode,
        ],
        default: [
          {
            attributes: { type: "text" } as UiNodeAttributes,
          } as UiNode,
        ],
      }
      const result = getFinalNodes(uniqueGroups, undefined)
      expect(result).toHaveLength(0)
    })

    test("should return selected nodes if no hidden nodes are found", () => {
      const uniqueGroups = {
        identifier_first: [
          {
            attributes: { type: "text" } as UiNodeAttributes,
          } as UiNode,
        ],
        default: [
          {
            attributes: { type: "text" } as UiNodeAttributes,
          } as UiNode,
        ],
      }
      const selectedGroup = UiNodeGroupEnum.Default
      const result = getFinalNodes(uniqueGroups, selectedGroup)
      expect(result).toHaveLength(1)
    })
  })
})
