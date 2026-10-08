// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  LoginFlow,
  RecoveryFlow,
  VerificationFlow,
} from "@ory/client-fetch"
import { fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { useFormContext } from "react-hook-form"
import { OryFlowProvider } from "../../context/flow-context"
import { rememberLastIdentifier } from "../../util/lastIdentifier"
import { OryFormProvider } from "./form-provider"

beforeEach(() => {
  window.sessionStorage.clear()
})

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

function addressFlow(
  field: { name: string; type: string; value?: string },
  state = "choose_method",
) {
  return {
    id: "flow-id",
    active: "code",
    state,
    ui: {
      action: "",
      method: "POST",
      nodes: [
        {
          type: "input",
          group: "code",
          messages: [],
          meta: {},
          attributes: { node_type: "input", ...field },
        },
      ],
    },
  }
}

const recoveryV1Flow = addressFlow({
  name: "email",
  type: "email",
}) as unknown as RecoveryFlow
const recoveryV2Flow = addressFlow(
  { name: "recovery_address", type: "text" },
  "recovery_awaiting_address",
) as unknown as RecoveryFlow

function AddressField({ name }: { name: string }) {
  const { register } = useFormContext()
  return <input data-testid="address" {...register(name)} />
}

function recoveryForm(flow: RecoveryFlow, name: string) {
  return (
    <OryFlowProvider flow={flow} flowType={FlowType.Recovery}>
      <OryFormProvider>
        <AddressField name={name} />
      </OryFormProvider>
    </OryFlowProvider>
  )
}

function addressValue() {
  return screen.getByTestId<HTMLInputElement>("address").value
}

test("should pre-fill the recovery email field with the last typed email", () => {
  rememberLastIdentifier("jane@example.com")
  render(recoveryForm(recoveryV1Flow, "email"))

  expect(addressValue()).toBe("jane@example.com")
})

test("should pre-fill the recovery address field with the last typed email", () => {
  rememberLastIdentifier("jane@example.com")
  render(recoveryForm(recoveryV2Flow, "recovery_address"))

  expect(addressValue()).toBe("jane@example.com")
})

test("should pre-fill the recovery address field with the last typed phone number", () => {
  rememberLastIdentifier("+4915112345678")
  render(recoveryForm(recoveryV2Flow, "recovery_address"))

  expect(addressValue()).toBe("+4915112345678")
})

test("should leave the recovery email field empty when the last typed identifier is a phone number", () => {
  rememberLastIdentifier("+4915112345678")
  render(recoveryForm(recoveryV1Flow, "email"))

  expect(addressValue()).toBe("")
})

test("should leave the recovery field empty when the last typed identifier is a username", () => {
  rememberLastIdentifier("jane")
  render(recoveryForm(recoveryV2Flow, "recovery_address"))

  expect(addressValue()).toBe("")
})

test("should leave the recovery field empty when no identifier was typed", () => {
  render(recoveryForm(recoveryV1Flow, "email"))

  expect(addressValue()).toBe("")
})

test("should keep the address the recovery flow already carries", () => {
  rememberLastIdentifier("jane@example.com")
  render(
    recoveryForm(
      addressFlow({
        name: "email",
        type: "email",
        value: "other@example.com",
      }) as unknown as RecoveryFlow,
      "email",
    ),
  )

  expect(addressValue()).toBe("other@example.com")
})

test("should keep the pre-filled recovery field editable and not fill it again", () => {
  rememberLastIdentifier("jane@example.com")
  const { rerender } = render(recoveryForm(recoveryV1Flow, "email"))

  fireEvent.change(screen.getByTestId("address"), { target: { value: "" } })
  rerender(recoveryForm(recoveryV1Flow, "email"))

  expect(addressValue()).toBe("")
})

test("should keep the last typed identifier available after pre-filling", () => {
  rememberLastIdentifier("jane@example.com")
  render(recoveryForm(recoveryV1Flow, "email")).unmount()
  render(recoveryForm(recoveryV1Flow, "email"))

  expect(addressValue()).toBe("jane@example.com")
})

test("should not pre-fill the email field of a verification flow", () => {
  rememberLastIdentifier("jane@example.com")
  render(
    <OryFlowProvider
      flow={recoveryV1Flow as unknown as VerificationFlow}
      flowType={FlowType.Verification}
    >
      <OryFormProvider>
        <AddressField name="email" />
      </OryFormProvider>
    </OryFlowProvider>,
  )

  expect(addressValue()).toBe("")
})

test("should not render the last typed identifier on the server", () => {
  rememberLastIdentifier("jane@example.com")
  function DefaultValue() {
    const { getValues } = useFormContext()
    return <span>{String(getValues("email"))}</span>
  }

  const html = renderToString(
    <OryFlowProvider flow={recoveryV1Flow} flowType={FlowType.Recovery}>
      <OryFormProvider>
        <DefaultValue />
      </OryFormProvider>
    </OryFlowProvider>,
  )

  expect(html).not.toContain("jane@example.com")
})
