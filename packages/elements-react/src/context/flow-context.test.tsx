// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { act, renderHook } from "@testing-library/react"
import { PropsWithChildren } from "react"
import { OryFlowContainer } from "../util/flowContainer"
import { OryFlowProvider, useOryFlow } from "./flow-context"

const input = (group: string, name: string, type: string, value?: string) => ({
  type: "input",
  group,
  attributes: { name, type, value, node_type: "input" },
  messages: [],
  meta: {},
})

test("should clear the active method against the current flow", () => {
  const aal2Login = {
    flowType: FlowType.Login,
    flow: {
      requested_aal: "aal2",
      ui: { nodes: [input("totp", "totp_code", "text")] },
    },
  } as unknown as OryFlowContainer
  const identifierFirstLogin = {
    flowType: FlowType.Login,
    flow: {
      active: "oidc",
      ui: {
        nodes: [
          input("oidc", "provider", "submit", "google"),
          input("identifier_first", "identifier", "text"),
        ],
      },
    },
  } as unknown as OryFlowContainer

  const wrapper = ({ children }: PropsWithChildren) => (
    <OryFlowProvider {...aal2Login}>{children}</OryFlowProvider>
  )
  const { result } = renderHook(() => useOryFlow(), { wrapper })

  act(() => {
    result.current.setFlowContainer(identifierFirstLogin)
  })
  act(() => {
    result.current.dispatchFormState({ type: "action_clear_active_method" })
  })

  expect(result.current.formState).toEqual({
    current: "provide_identifier",
    isReady: true,
    isSubmitting: false,
  })
})
