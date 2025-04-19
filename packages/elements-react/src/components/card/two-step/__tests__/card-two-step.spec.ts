// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AuthenticatorAssuranceLevel,
  FlowType,
  UiNode,
  UiNodeAttributes,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import {
  LoginFlowContainer,
  RegistrationFlowContainer,
} from "@ory/elements-react"
import { getFinalNodes, isChoosingMethod } from "../utils"

const makeFlow = (
  nodes: UiNode[],
  flowType?: FlowType.Login | FlowType.Registration,
  requested_aal?: AuthenticatorAssuranceLevel,
) =>
  ({
    flowType,
    flow: {
      requested_aal,
      ui: {
        nodes,
      },
    },
  }) as LoginFlowContainer | RegistrationFlowContainer

describe("CardTwoStep/utils", () => {
  describe("isChoosingMethod", () => {
    test("should return true if a node has value 'screen=previous'", () => {
      const uiNodes: UiNode[] = [
        {
          attributes: { value: "previous", name: "screen" } as UiNodeAttributes,
          group: UiNodeGroupEnum.Default,
        } as UiNode,
      ]
      expect(isChoosingMethod(makeFlow(uiNodes))).toBe(true)
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
      expect(isChoosingMethod(makeFlow(uiNodes))).toBe(true)
    })

    test("should return true if a flow is aal2 login", () => {
      expect(isChoosingMethod(makeFlow([], FlowType.Login, "aal2"))).toBe(true)
    })

    test("should return false if no conditions are met", () => {
      const uiNodes: UiNode[] = [
        {
          attributes: { name: "other", type: "text" } as UiNodeAttributes,
          group: UiNodeGroupEnum.Default,
        } as UiNode,
      ]
      expect(isChoosingMethod(makeFlow(uiNodes, FlowType.Login, "aal1"))).toBe(
        false,
      )
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
