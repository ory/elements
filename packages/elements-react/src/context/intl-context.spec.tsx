// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render } from "@testing-library/react"
import { IntlProvider as OriginalIntlProvider, useIntl } from "react-intl"
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
