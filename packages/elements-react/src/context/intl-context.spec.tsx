// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render } from "@testing-library/react"
import { IntlProvider } from "./intl-context"
import { useIntl } from "react-intl"

function Render({ messageId }: { messageId: string }) {
  const intl = useIntl()
  return intl.formatMessage({ id: messageId })
}

describe("intl-context", () => {
  test("uses default messages", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <Render messageId="settings.navigation.title" />
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
            "settings.navigation.title": "custom navigation title",
          },
        }}
      >
        <Render messageId="settings.navigation.title" />
      </IntlProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  test("uses default messages in different language", () => {
    const { container } = render(
      <IntlProvider locale="de">
        <Render messageId="settings.navigation.title" />
      </IntlProvider>,
    )
    expect(container).toMatchSnapshot()
  })
})
