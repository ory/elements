// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { act, screen, waitFor } from "@testing-library/react"
import { IntlProvider } from "../../context/intl-context"
import { useOryFlow } from "../../context/flow-context"
import { renderWithOryElements } from "../../tests/jest/test-utils"
import { FormValues } from "../../types"
import {
  useOryFormSubmit,
  withoutForeignMethodFields,
} from "./useOryFormSubmit"

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

function rateLimitedResponseError() {
  const response = {
    status: 429,
    headers: {
      get: (name: string) => (name === "retry-after" ? "1" : null),
    },
  }
  return Object.assign(new Error("Too Many Requests"), {
    name: "ResponseError",
    response,
  })
}

// Captures the submit handler so the test can drive a real submission through
// production code, and renders the form's submitting state plus its messages.
let triggerSubmit: (() => Promise<void>) | undefined

function SubmitHarness() {
  const { formState, flow } = useOryFlow()
  const onSubmit = useOryFormSubmit()
  triggerSubmit = () =>
    onSubmit({
      method: "password",
      identifier: "user@example.com",
      password: "secret",
    } as never) as Promise<void>
  return (
    <>
      <span data-testid="submitting">{String(formState.isSubmitting)}</span>
      <ul data-testid="messages">
        {(flow.ui.messages ?? []).map((m) => (
          <li key={m.id}>{m.text}</li>
        ))}
      </ul>
    </>
  )
}

test("should end the submit state after a rate-limited (429) submission so the form stays usable", async () => {
  jest
    .spyOn(await import("../../util/client"), "frontendClient")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockReturnValue({
      updateLoginFlowRaw: jest
        .fn()
        .mockRejectedValue(rateLimitedResponseError()),
    } as any)

  renderWithOryElements(
    <IntlProvider locale="en">
      <SubmitHarness />
    </IntlProvider>,
  )

  expect(screen.getByTestId("submitting").textContent).toBe("false")

  await act(async () => {
    await triggerSubmit?.()
  })

  // Without ending the submit state on rate_limited, action_flow_update would
  // preserve isSubmitting=true and freeze the form.
  await waitFor(() =>
    expect(screen.getByTestId("submitting").textContent).toBe("false"),
  )

  // The default rate-limit message is shown to the user.
  await waitFor(() =>
    expect(
      screen.getByText(/Too many requests\. Please wait a moment/i),
    ).toBeInTheDocument(),
  )
})

test("should keep the traits a single sign-on submission is allowed to carry", () => {
  // FormValues does not model the nested objects react-hook-form produces for
  // dotted node names, so the trait map needs a cast to fit the signature.
  const data = {
    method: "oidc",
    provider: "google",
    csrf_token: "token",
    traits: { email: "user@example.org", age_disclaimer: true },
    transient_payload: { source: "cart" },
    upstream_parameters: { prompt: "select_account" },
  } as unknown as FormValues

  expect(withoutForeignMethodFields(FlowType.Registration, data)).toEqual(data)
})

const foreignFields = ["password", "code", "totp_code", "identifier"]
foreignFields.forEach((field) => {
  test(`should drop "${field}" from a single sign-on submission`, () => {
    const result = withoutForeignMethodFields(FlowType.Login, {
      method: "oidc",
      provider: "google",
      [field]: "value",
    })

    expect(result).not.toHaveProperty(field)
    expect(result).toMatchObject({ method: "oidc", provider: "google" })
  })
})

test("should drop foreign fields for the saml method as well", () => {
  expect(
    withoutForeignMethodFields(FlowType.Login, {
      method: "saml",
      provider: "okta",
      password: "hunter2",
    }),
  ).toEqual({ method: "saml", provider: "okta" })
})

test("should leave submissions of other methods untouched", () => {
  const data = { method: "password", identifier: "user", password: "hunter2" }
  expect(withoutForeignMethodFields(FlowType.Login, data)).toEqual(data)
})

test("should leave provider linking in the settings flow untouched", () => {
  // Linking and unlinking submit the oidc method too, with fields that are not
  // part of a sign-in submission.
  const data = { method: "oidc", link: "google", csrf_token: "token" }
  expect(withoutForeignMethodFields(FlowType.Settings, data)).toEqual(data)
})
