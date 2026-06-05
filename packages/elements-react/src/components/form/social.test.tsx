// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, type LoginFlow, type UiNode } from "@ory/client-fetch"
import { IntlProvider } from "../../context/intl-context"
import { renderWithOryElements } from "../../tests/jest/test-utils"
import type { OryFlowContainer } from "../../util"
import { OryFormSsoButtons } from "./social"

const oidcNode = (provider: string): UiNode => ({
  type: "input",
  group: "oidc",
  messages: [],
  meta: {
    label: {
      id: 1040002,
      text: `Sign in with ${provider}`,
      type: "info",
      context: { provider, provider_id: provider },
    },
  },
  attributes: {
    name: "provider",
    type: "submit",
    value: provider,
    disabled: false,
    node_type: "input",
  },
})

function multiProviderFlow(): OryFlowContainer {
  return {
    flowType: FlowType.Login,
    flow: {
      id: "test-flow",
      type: "browser",
      expires_at: "2026-01-01T00:00:00.000Z",
      issued_at: "2026-01-01T00:00:00.000Z",
      request_url: "http://localhost/self-service/login/browser",
      ui: {
        action: "http://localhost/self-service/login",
        method: "POST",
        nodes: [oidcNode("google"), oidcNode("discord")],
        messages: [],
      },
    } as unknown as LoginFlow,
  }
}

describe("OryFormSsoButtons", () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  test("should render unique React keys for multiple OIDC providers", () => {
    // IntlProvider is required at the call site because the default
    // DefaultButtonSocial theme component calls useIntl(), and the
    // test-utils OryProvider does not install an intl context.
    renderWithOryElements(
      <IntlProvider locale="en">
        <OryFormSsoButtons />
      </IntlProvider>,
      {
        flow: multiProviderFlow(),
      },
    )

    const duplicateKeyWarnings = errorSpy.mock.calls.filter(
      (call) =>
        typeof call[0] === "string" &&
        call[0].includes("Encountered two children with the same key"),
    )

    expect(duplicateKeyWarnings).toEqual([])
  })
})
