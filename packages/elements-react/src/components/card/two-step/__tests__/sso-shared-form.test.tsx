// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, RegistrationFlow, UiNode } from "@ory/client-fetch"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { OryFlowContainer } from "../../../../util"
import { onSubmitRegistration } from "../../../../util/onSubmitRegistration"
import { ProvideIdentifierForm } from "../state-provide-identifier"

jest.mock("../../../../util/onSubmitRegistration", () => ({
  onSubmitRegistration: jest.fn(),
}))

// `jest-transform-stub` turns SVG imports into empty strings, which React then
// treats as the element's tag name and JSDOM rejects. Every icon the default
// theme renders on this screen needs a stand-in. Same workaround as in the
// DefaultCard test.
jest.mock("../../../../theme/default/assets/ory-badge-horizontal.svg", () =>
  StubIcon(),
)
jest.mock("../../../../theme/default/assets/ory-badge-vertical.svg", () =>
  StubIcon(),
)
jest.mock("../../../../theme/default/assets/icons/eye.svg", () => StubIcon())
jest.mock("../../../../theme/default/assets/icons/eye-off.svg", () =>
  StubIcon(),
)
jest.mock("../../../../theme/default/provider-logos", () => ({
  __esModule: true,
  default: {},
}))

function StubIcon() {
  return function StubIcon() {
    return <svg />
  }
}

const onSubmitRegistrationMock = jest.mocked(onSubmitRegistration)

const csrfNode: UiNode = {
  type: "input",
  group: "default",
  messages: [],
  meta: {},
  attributes: {
    name: "csrf_token",
    type: "hidden",
    value: "csrf",
    required: true,
    disabled: false,
    node_type: "input",
  },
}

const emailNode: UiNode = {
  type: "input",
  group: "default",
  messages: [],
  meta: { label: { id: 1070007, text: "Email", type: "info" } },
  attributes: {
    name: "traits.email",
    type: "email",
    required: true,
    disabled: false,
    node_type: "input",
  },
}

const disclaimerNode: UiNode = {
  type: "input",
  group: "default",
  messages: [],
  meta: {
    label: {
      id: 1070002,
      text: "I am 13 years of age or older",
      type: "info",
      context: { title: "I am 13 years of age or older" },
    },
  },
  attributes: {
    name: "traits.age_disclaimer",
    type: "checkbox",
    required: true,
    disabled: false,
    node_type: "input",
  },
}

const passwordNode: UiNode = {
  type: "input",
  group: "password",
  messages: [],
  meta: { label: { id: 1070001, text: "Password", type: "info" } },
  attributes: {
    name: "password",
    type: "password",
    required: true,
    disabled: false,
    node_type: "input",
  },
}

const googleNode: UiNode = {
  type: "input",
  group: "oidc",
  messages: [],
  meta: {
    label: {
      id: 1040002,
      text: "Sign up with google",
      type: "info",
      context: { provider: "google", provider_id: "google" },
    },
  },
  attributes: {
    name: "provider",
    type: "submit",
    value: "google",
    disabled: false,
    node_type: "input",
  },
}

function registrationFlow(): OryFlowContainer {
  return {
    flowType: FlowType.Registration,
    flow: {
      id: "test-flow",
      type: "browser",
      expires_at: "2026-01-01T00:00:00.000Z",
      issued_at: "2026-01-01T00:00:00.000Z",
      request_url: "http://localhost/self-service/registration/browser",
      ui: {
        action: "http://localhost/self-service/registration",
        method: "POST",
        nodes: [csrfNode, emailNode, disclaimerNode, passwordNode, googleNode],
        messages: [],
      },
    } as unknown as RegistrationFlow,
  }
}

function renderForm() {
  return renderWithOryElements(
    <IntlProvider locale="en">
      <ProvideIdentifierForm />
    </IntlProvider>,
    {
      flow: registrationFlow(),
      // The default header renders the current-identifier button, which pulls in the
      // session client. Nothing in this test needs it.
      components: { Card: { Header: () => null } },
    },
  )
}

function submittedBody() {
  expect(onSubmitRegistrationMock).toHaveBeenCalledTimes(1)
  return onSubmitRegistrationMock.mock.calls[0][2].body as unknown as Record<
    string,
    unknown
  >
}

describe("single sign-on submit on the unified registration screen", () => {
  beforeEach(() => {
    onSubmitRegistrationMock.mockClear()
  })

  test("should submit trait values the user entered before clicking a provider", async () => {
    const { container } = renderForm()

    fireEvent.click(screen.getByRole("checkbox"))
    fireEvent.click(container.querySelector("button[value='google']")!)

    await waitFor(() => expect(onSubmitRegistrationMock).toHaveBeenCalled())
    expect(submittedBody()).toMatchObject({
      method: "oidc",
      provider: "google",
      traits: { age_disclaimer: true },
    })
  })

  test("should not submit credentials belonging to another method", async () => {
    const { container } = renderForm()

    fireEvent.change(container.querySelector("input[name='password']")!, {
      target: { value: "correct horse battery staple" },
    })
    fireEvent.click(container.querySelector("button[value='google']")!)

    await waitFor(() => expect(onSubmitRegistrationMock).toHaveBeenCalled())
    expect(submittedBody()).not.toHaveProperty("password")
  })
})
