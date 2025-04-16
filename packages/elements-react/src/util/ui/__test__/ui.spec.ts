// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import allMethodsInitialForm from "./.fixtures/initial-form.json"
import omitHiddenInput from "./.fixtures/omit-hidden-input.json"

import { useNodesGroups } from ".."
import { UiNode } from "@ory/client-fetch"
import { renderHook } from "@testing-library/react"

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
