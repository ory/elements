// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { screen } from "@testing-library/dom"
import { render } from "@testing-library/react"
import { useIntl } from "react-intl"
import { IntlProvider } from "../../../context/intl-context"
import { resolveLabel, resolveOptionLabel } from "../../nodes"
import { resolvePlaceholder } from "../index"

const traitText: UiText = {
  id: 1070002,
  text: "E-Mail",
  type: "info",
  context: { title: "E-Mail", name: "traits.email" },
}

const Resolvers = ({ uiText }: { uiText: UiText }) => {
  const intl = useIntl()

  return (
    <div>
      <span data-testid="placeholder">{resolvePlaceholder(uiText, intl)}</span>
      <span data-testid="label">{resolveLabel(uiText, intl)}</span>
      <span data-testid="option">
        {resolveOptionLabel("traits.country", "DE", intl)}
      </span>
    </div>
  )
}

describe("optional forms.* translations", () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  test("should not log MISSING_TRANSLATION errors when no custom translation is defined", () => {
    render(
      <IntlProvider locale="af">
        <Resolvers uiText={traitText} />
      </IntlProvider>,
    )

    // The fallback text must still render correctly.
    expect(screen.getByTestId("placeholder").textContent).toBe(
      "Voer jou E-Mail in",
    )
    expect(screen.getByTestId("label").textContent).toBe("E-Mail")
    expect(screen.getByTestId("option").textContent).toBe("DE")

    const missingTranslationErrors = consoleErrorSpy.mock.calls.filter((args) =>
      args.some((arg: unknown) => String(arg).includes("MISSING_TRANSLATION")),
    )
    expect(missingTranslationErrors).toEqual([])
  })

  test("should not log MISSING_TRANSLATION errors when a custom translation key holds an undefined value", () => {
    render(
      <IntlProvider
        locale="af"
        customTranslations={{
          // Simulates a consumer outside strict TypeScript passing explicit
          // undefined values, which still create keys on the merged catalogue.
          af: {
            "forms.input.placeholder.traits.email": undefined,
            "forms.label.traits.email": undefined,
            "forms.option.traits.country.DE": undefined,
          } as unknown as Record<string, string>,
        }}
      >
        <Resolvers uiText={traitText} />
      </IntlProvider>,
    )

    // The fallback text must still render correctly.
    expect(screen.getByTestId("placeholder").textContent).toBe(
      "Voer jou E-Mail in",
    )
    expect(screen.getByTestId("label").textContent).toBe("E-Mail")
    expect(screen.getByTestId("option").textContent).toBe("DE")

    const missingTranslationErrors = consoleErrorSpy.mock.calls.filter((args) =>
      args.some((arg: unknown) => String(arg).includes("MISSING_TRANSLATION")),
    )
    expect(missingTranslationErrors).toEqual([])
  })

  test("should use custom translations when they are defined", () => {
    render(
      <IntlProvider
        locale="af"
        customTranslations={{
          af: {
            "forms.input.placeholder.traits.email": "Aangepaste plekhouer",
            "forms.label.traits.email": "Aangepaste etiket",
            "forms.option.traits.country.DE": "Duitsland",
          },
        }}
      >
        <Resolvers uiText={traitText} />
      </IntlProvider>,
    )

    expect(screen.getByTestId("placeholder").textContent).toBe(
      "Aangepaste plekhouer",
    )
    expect(screen.getByTestId("label").textContent).toBe("Aangepaste etiket")
    expect(screen.getByTestId("option").textContent).toBe("Duitsland")
  })
})
