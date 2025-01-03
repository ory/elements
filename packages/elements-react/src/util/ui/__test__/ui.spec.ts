// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import allMethodsInitialForm from "../../../../../elements-react-stories/src/elements-react/.stub-responses/login/1fa/all-methods/initial-form.json"

import { nodesToAuthMethodGroups, useNodesGroups } from ".."
import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { renderHook } from "@testing-library/react"

describe("utils/ui", () => {
  test("useNodesGroups", () => {
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

  describe("nodesToAuthMethodGroups", () => {
    const testNodes: UiNode[] = [
      { group: UiNodeGroupEnum.Default, type: "input" } as UiNode,
      { group: UiNodeGroupEnum.Password, type: "input" } as UiNode,
      { group: UiNodeGroupEnum.Passkey, type: "input" } as UiNode,
      { group: UiNodeGroupEnum.Oidc, type: "input" } as UiNode,
      { group: UiNodeGroupEnum.IdentifierFirst, type: "input" } as UiNode,
      { group: UiNodeGroupEnum.Profile, type: "input" } as UiNode,
    ]

    it("should return auth method groups excluding default, identifier_first, profile, and oidc", () => {
      const result = nodesToAuthMethodGroups(testNodes)
      expect(result).toEqual([
        UiNodeGroupEnum.Password,
        UiNodeGroupEnum.Passkey,
      ])
    })

    it("should return auth method groups excluding specified auth methods", () => {
      const result = nodesToAuthMethodGroups(testNodes, [
        UiNodeGroupEnum.Passkey,
        UiNodeGroupEnum.Oidc,
      ])
      expect(result).toEqual([UiNodeGroupEnum.Password])
    })

    it("should return an empty array if no auth method groups are present", () => {
      const result = nodesToAuthMethodGroups([
        { group: UiNodeGroupEnum.Default, type: "input" } as UiNode,
        { group: UiNodeGroupEnum.IdentifierFirst, type: "input" } as UiNode,
      ])
      expect(result).toEqual([])
    })

    it("should handle an empty nodes array", () => {
      const result = nodesToAuthMethodGroups([])
      expect(result).toEqual([])
    })
  })
})
