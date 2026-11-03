// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from "@ory/client-fetch"
import { act, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { OryFormProvider } from "../../../../components/form/form-provider"
import { OryFlowProvider, useOryFlow } from "../../../../context/flow-context"
import { DefaultFormContainer } from "./index"

const flow = {
  active: "default",
  ui: { action: "", method: "POST", nodes: [] },
} as unknown as LoginFlow

let dispatch: ReturnType<typeof useOryFlow>["dispatchFormState"]

function Capture() {
  dispatch = useOryFlow().dispatchFormState
  return null
}

const tree = (
  <OryFlowProvider flow={flow} flowType={FlowType.Login}>
    <OryFormProvider>
      <Capture />
      <DefaultFormContainer onSubmit={() => {}} />
    </OryFormProvider>
  </OryFlowProvider>
)

test("should mark the form as hydrating in the server HTML", () => {
  const html = renderToString(tree)
  expect(html).toContain('aria-busy="true"')
  expect(html).toContain('data-busy="hydrating"')
})

test("should drop the busy attributes after mount", () => {
  const { container } = render(tree)
  const form = container.querySelector("form")
  expect(form).not.toHaveAttribute("aria-busy")
  expect(form).not.toHaveAttribute("data-busy")
})

test("should mark the form as submitting while it submits", () => {
  const { container } = render(tree)

  act(() => dispatch({ type: "form_submit_start" }))

  const form = container.querySelector("form")
  expect(form).toHaveAttribute("aria-busy", "true")
  expect(form).toHaveAttribute("data-busy", "submitting")
})
