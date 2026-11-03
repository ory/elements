// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from "@ory/client-fetch"
import { act, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { OryFormProvider } from "../components/form/form-provider"
import { OryFlowProvider, useOryFlow } from "./flow-context"
import { useOryFormBusy } from "./form-busy"

const flow = {
  active: "default",
  ui: { action: "", method: "POST", nodes: [] },
} as unknown as LoginFlow

let dispatch: ReturnType<typeof useOryFlow>["dispatchFormState"]

function BusyProbe() {
  const busy = useOryFormBusy()
  dispatch = useOryFlow().dispatchFormState
  return <span data-testid="busy">{busy ?? "idle"}</span>
}

const tree = (
  <OryFlowProvider flow={flow} flowType={FlowType.Login}>
    <OryFormProvider>
      <BusyProbe />
    </OryFormProvider>
  </OryFlowProvider>
)

test("should read hydrating in the server render", () => {
  expect(renderToString(tree)).toContain(">hydrating<")
})

test("should be idle after mount", () => {
  render(tree)
  expect(screen.getByTestId("busy")).toHaveTextContent("idle")
})

test("should read submitting while the form submits", () => {
  render(tree)

  act(() => dispatch({ type: "form_submit_start" }))
  expect(screen.getByTestId("busy")).toHaveTextContent("submitting")

  act(() => dispatch({ type: "form_submit_end" }))
  expect(screen.getByTestId("busy")).toHaveTextContent("idle")
})
