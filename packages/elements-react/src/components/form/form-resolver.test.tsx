// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from "@ory/client-fetch"
import { renderHook } from "@testing-library/react"
import { PropsWithChildren } from "react"
import { OryFlowProvider } from "../../context/flow-context"
import { FormValues } from "../../types"
import { useOryFormResolver } from "./form-resolver"

const testCases = [
  {
    method: "code",
    code: "",
    email: "",
  },
  {
    method: "code",
  },
  {
    method: "code",
    code: "123456",
    email: "",
  },
  {
    method: "code",
    code: "123456",
    email: "some@example.com",
  },
  {
    method: "password",
  },
] satisfies FormValues[]

const wrapper = ({ children }: PropsWithChildren) => (
  <OryFlowProvider
    flow={
      {
        active: "code",
        ui: {
          nodes: [
            {
              group: "code",
              attributes: {
                node_type: "input",
                name: "code",
                type: "text",
              },
            },
          ],
          action: "",
          method: "",
        },
      } as unknown as LoginFlow // Fine, we're just testing the resolver
    }
    flowType={FlowType.Login}
  >
    {children}
  </OryFlowProvider>
)

for (const testCase of testCases) {
  test("case=" + JSON.stringify(testCase), () => {
    const formResolver = renderHook(() => useOryFormResolver(), {
      wrapper,
    })
    expect(formResolver.result.current(testCase)).toMatchSnapshot()
  })
}
