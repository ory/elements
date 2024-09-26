import allMethodsInitialForm from "../../../../../elements-react-stories/src/elements-react/.stub-responses/login/1fa/all-methods/initial-form.json"

import { renderHook } from "@tests/jest/test-utils"
import { useNodesGroups } from ".."
import { UiNode } from "@ory/client-fetch"

describe("utils/ui", () => {
  test("useNodesGroups", () => {
    const { result } = renderHook(() =>
      useNodesGroups(allMethodsInitialForm.ui.nodes as UiNode[]),
    )

    expect(result.current.oidc).toHaveLength(2)
    expect(result.current.default).toHaveLength(2)
    expect(result.current.webauthn).toHaveLength(2)
    expect(result.current.passkey).toHaveLength(3)
    expect(result.current.password).toHaveLength(2)
    expect(result.current.code).toHaveLength(1)
  })
})
