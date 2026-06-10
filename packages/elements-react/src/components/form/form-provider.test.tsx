// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from "@ory/client-fetch"
import { render, screen } from "@testing-library/react"
import { useFormContext } from "react-hook-form"
import { OryFlowProvider } from "../../context/flow-context"
import { OryFormProvider } from "./form-provider"

function loginFlowWithIdentifier({
  requestUrl = "https://ory.example/self-service/login/browser",
  oidcLoginHint,
}: { requestUrl?: string; oidcLoginHint?: string } = {}): LoginFlow {
  return {
    active: "default",
    request_url: requestUrl,
    oauth2_login_request:
      oidcLoginHint !== undefined
        ? { oidc_context: { login_hint: oidcLoginHint } }
        : undefined,
    ui: {
      action: "",
      method: "POST",
      nodes: [
        {
          group: "default",
          attributes: {
            node_type: "input",
            name: "identifier",
            type: "text",
            value: "",
          },
        },
      ],
    },
  } as unknown as LoginFlow
}

function IdentifierProbe() {
  const { getValues } = useFormContext()
  return (
    <span data-testid="identifier">
      {String(getValues("identifier") ?? "")}
    </span>
  )
}

function renderProvider(flow: LoginFlow) {
  return render(
    <OryFlowProvider flow={flow} flowType={FlowType.Login}>
      <OryFormProvider>
        <IdentifierProbe />
      </OryFormProvider>
    </OryFlowProvider>,
  )
}

test("should pre-fill the identifier from the login_hint on the flow's request_url", () => {
  renderProvider(
    loginFlowWithIdentifier({
      requestUrl:
        "https://ory.example/self-service/login/browser?login_hint=jane@example.com",
    }),
  )
  expect(screen.getByTestId("identifier").textContent).toBe("jane@example.com")
})

test("should pre-fill the identifier from the oidc_context login_hint", () => {
  renderProvider(loginFlowWithIdentifier({ oidcLoginHint: "oidc@example.com" }))
  expect(screen.getByTestId("identifier").textContent).toBe("oidc@example.com")
})

test("should leave the identifier empty when no login_hint is present", () => {
  renderProvider(loginFlowWithIdentifier())
  expect(screen.getByTestId("identifier").textContent).toBe("")
})
