// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { IntlProvider } from "../../../context/intl-context"
import type { UiText } from "@ory/client-fetch"
import { Inner } from "./test-components"
import { renderWithOryElements } from "../../../tests/jest/test-utils"
import { screen } from "@testing-library/dom"

const uiText: UiText = {
  id: 1050010,
  text: "These are your back up recovery codes. Please keep them in a safe place!",
  type: "info",
}

describe("uiTextToFormattedMessage", () => {
  test("should fall back to server text when context contains an empty array", () => {
    const duplicateCredentialMsg: UiText = {
      id: 4000028,
      text: "You tried signing in with user@example.com which is already in use by another account. You can sign in using your password.",
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

    // With an empty array, it falls back to the original text from the API which
    // omits the section about social sign in providers.
    const rendered = screen.getByText(/You tried signing in with/)
    expect(rendered.textContent).not.toContain("social sign in providers")
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
