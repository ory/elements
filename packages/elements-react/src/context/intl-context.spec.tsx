// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render } from "@testing-library/react"
import { IntlProvider as OriginalIntlProvider, useIntl } from "react-intl"
import { OryLocales } from "../locales"
import { IntlProvider } from "./intl-context"

function Render({
  messageId,
  defaultMessage,
}: {
  messageId: string
  defaultMessage?: string
}) {
  const intl = useIntl()
  return intl.formatMessage({ id: messageId, defaultMessage })
}

describe("intl-context", () => {
  test("uses default messages", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <Render messageId="settings.title" />
      </IntlProvider>,
    )
    expect(container).toMatchSnapshot()
  })
  test("can override individual strings", () => {
    const { container } = render(
      <IntlProvider
        locale="en"
        customTranslations={{
          en: {
            "settings.title": "custom title",
          },
        }}
      >
        <Render messageId="settings.title" />
      </IntlProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  test("uses default messages in different language", () => {
    const { container } = render(
      <IntlProvider locale="de">
        <Render messageId="settings.title" />
      </IntlProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  test("doesn't override if an IntlContext is already present", () => {
    const { container } = render(
      <OriginalIntlProvider
        locale="de"
        messages={{
          "settings.title": "original title",
        }}
      >
        <IntlProvider locale="en">
          <Render messageId="settings.title" />
        </IntlProvider>
      </OriginalIntlProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  test("doesn't read custom translations if an IntlContext is already present", () => {
    const customTranslations = {
      get en(): Record<string, string> {
        throw new Error("custom translations were read")
      },
    }
    const { container } = render(
      <OriginalIntlProvider
        locale="en"
        messages={{
          "settings.title": "original title",
        }}
      >
        <IntlProvider locale="en" customTranslations={customTranslations}>
          <Render messageId="settings.title" />
        </IntlProvider>
      </OriginalIntlProvider>,
    )
    expect(container).toHaveTextContent("original title")
  })

  test("applies overrides from a dictionary with many keys", () => {
    const en: Record<string, string> = {}
    for (let i = 0; i < 30000; i++) {
      en[`custom.key.${i}`] = "value"
    }
    en["settings.title"] = "custom title"

    const start = performance.now()
    const { container } = render(
      <IntlProvider locale="en" customTranslations={{ en }}>
        <Render messageId="settings.title" />
      </IntlProvider>,
    )
    expect(container).toHaveTextContent("custom title")
    expect(performance.now() - start).toBeLessThan(5000)
  })

  test("uses the default message for custom values that are not strings", () => {
    const en = {
      "settings.title": 42,
      "settings.subtitle": null,
    } as unknown as Record<string, string>

    const { container } = render(
      <IntlProvider locale="en" customTranslations={{ en }}>
        <Render messageId="settings.title" />
        <Render messageId="settings.subtitle" />
      </IntlProvider>,
    )
    expect(container).toHaveTextContent(
      OryLocales.en["settings.title"] + OryLocales.en["settings.subtitle"],
    )
  })

  test("treats a __proto__ key as a plain message id", () => {
    const en = JSON.parse(
      '{"__proto__": "custom proto", "settings.title": "custom title"}',
    ) as Record<string, string>

    const { container } = render(
      <IntlProvider locale="en" customTranslations={{ en }}>
        <Render messageId="settings.title" />
        <Render messageId="__proto__" />
      </IntlProvider>,
    )
    expect(container).toHaveTextContent("custom titlecustom proto")
  })

  test("renders the default message when the locale lacks the key", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {})
    const { container } = render(
      <IntlProvider locale="de">
        <Render
          messageId="test.only-in-source"
          defaultMessage="Only in source"
        />
      </IntlProvider>,
    )
    expect(container).toHaveTextContent("Only in source")
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})
