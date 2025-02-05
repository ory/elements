// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import allMethodsInitialForm from "$stories/.stub-responses/login/1fa/all-methods/initial-form.json"

import { useNodesGroups } from ".."
import { UiNode } from "@ory/client-fetch"
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
})
