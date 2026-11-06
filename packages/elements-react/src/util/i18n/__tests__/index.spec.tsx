// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { IntlProvider } from "../../../context/intl-context"
import { UiText } from "@ory/client-fetch"
import { Inner } from "./test-components"
import { renderWithOryElements } from "../../../tests/jest/test-utils"
import { screen } from "@testing-library/dom"

const uiText: UiText = {
  id: 1050010,
  text: "These are your back up recovery codes. Please keep them in a safe place!",
  type: "info",
}

describe("uiTextToFormattedMessage", () => {
  test("should format the translated message when context contains an empty array", () => {
    const duplicateCredentialMsg: UiText = {
      id: 4000028,
      text: "raw server text",
      type: "error",
      context: {
        available_credential_types: ["password"],
        available_oidc_providers: [],
        credential_identifier_hint: "user@example.com",
      },
    }

    renderWithOryElements(
      <IntlProvider locale={"en"}>
        <Inner uiText={duplicateCredentialMsg} />
      </IntlProvider>,
    )

    // The message is formatted from the locale template, not the raw API text,
    // and the sentence about social sign in providers is omitted because the
    // provider list is empty.
    const rendered = screen.getByText(/You tried signing in with/)
    expect(rendered.textContent).toContain("user@example.com")
    expect(rendered.textContent).toContain("You can sign in using")
    expect(rendered.textContent).not.toContain("social sign in providers")
  })

  test("should honor custom translations when context contains an empty array", () => {
    const duplicateCredentialMsg: UiText = {
      id: 4000028,
      text: "raw server text",
      type: "error",
      context: {
        available_credential_types: ["password"],
        available_oidc_providers: [],
        credential_identifier_hint: "user@example.com",
      },
    }

    renderWithOryElements(
      <IntlProvider
        locale={"en"}
        customTranslations={{
          en: {
            "identities.messages.4000028":
              "Custom duplicate account message for {credential_identifier_hint}",
          },
        }}
      >
        <Inner uiText={duplicateCredentialMsg} />
      </IntlProvider>,
    )

    expect(
      screen.getByText("Custom duplicate account message for user@example.com"),
    ).toBeTruthy()
  })

  test("should use intl formatted message when context arrays are non-empty", () => {
    const duplicateCredentialMsg: UiText = {
      id: 4000028,
      text: "You tried signing in with user@example.com which is already in use by another account. You can sign in using your password. You can sign in using one of the following social sign in providers: Google.",
      type: "error",
      context: {
        available_credential_types: ["password"],
        available_oidc_providers: ["Google"],
        credential_identifier_hint: "user@example.com",
      },
    }

    renderWithOryElements(
      <IntlProvider locale={"en"}>
        <Inner uiText={duplicateCredentialMsg} />
      </IntlProvider>,
    )

    // With non-empty arrays, react-intl formats the template and resolves
    // {available_oidc_providers_list} to the actual provider names.
    const rendered = screen.getByText(/You tried signing in with/)
    expect(rendered.textContent).toContain("Google")
  })
})

describe("relative wait from a _unix context value", () => {
  const now = new Date("2026-01-01T00:00:00Z")

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const cases = [
    { wait: 1, rendered: "in 1 second" },
    { wait: 90, rendered: "in 90 seconds" },
    { wait: 120, rendered: "in 2 minutes" },
    { wait: 121, rendered: "in 3 minutes" },
    { wait: 3600, rendered: "in 60 minutes" },
    { wait: 7200, rendered: "in 2 hours" },
    { wait: 172800, rendered: "in 2 days" },
    { wait: -30, rendered: "now" },
  ]

  cases.forEach(({ wait, rendered }) => {
    test(`should render a wait of ${wait} seconds as "${rendered}"`, () => {
      const throttled: UiText = {
        id: 4010012,
        text: "raw server text",
        type: "error",
        context: {
          retry_after: wait,
          retry_at_unix: now.getTime() / 1000 + wait,
        },
      }

      renderWithOryElements(
        <IntlProvider locale={"en"}>
          <Inner uiText={throttled} />
        </IntlProvider>,
      )

      expect(
        screen.getByText(
          `Too many failed login attempts. Please try again ${rendered}.`,
        ),
      ).toBeTruthy()
    })
  })
})

describe("IntlProvider", () => {
  test("should return the german locale", () => {
    renderWithOryElements(
      <IntlProvider locale={"de"}>
        <Inner uiText={uiText} />
      </IntlProvider>,
    )

    expect(
      screen.getByText(
        "Dies sind Ihre Backup-Wiederherstellungscodes. Bewahren Sie diese an einem sicheren Ort auf!",
      ),
    ).toBeTruthy()
  })

  test("should return the polish locale", () => {
    renderWithOryElements(
      <IntlProvider locale={"pl"}>
        <Inner uiText={uiText} />
      </IntlProvider>,
    )

    expect(
      screen.getByText(
        "To są Twoje zapasowe kody odzyskiwania. Trzymaj je w bezpiecznym miejscu!",
      ),
    ).toBeTruthy()
  })
})
