// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import allMethodsInitialForm from "../../../../../elements-react-stories/src/elements-react/.stub-responses/login/1fa/all-methods/initial-form.json"

import { renderHook } from "@tests/jest/test-utils"
import { useNodesGroups } from ".."
import { UiNode } from "@ory/client-fetch"

describe("utils/ui", () => {
  test("useNodesGroups", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const { result } = renderHook(() =>
      useNodesGroups(allMethodsInitialForm.ui.nodes as UiNode[]),
    )

    expect(result.current.groups.oidc).toHaveLength(2)
    expect(result.current.groups.default).toHaveLength(2)
    expect(result.current.groups.webauthn).toHaveLength(2)
    expect(result.current.groups.passkey).toHaveLength(3)
    expect(result.current.groups.password).toHaveLength(2)
    expect(result.current.groups.code).toHaveLength(1)
  })
})
