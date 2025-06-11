// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { IntlProvider } from "../../../context/intl-context"
import { UiText } from "@ory/client-fetch"
import { Inner } from "./test-components"
import { renderWithComponents } from "../../../tests/jest/test-utils"
import { screen } from "@testing-library/dom"

const uiText: UiText = {
  id: 1050010,
  text: "These are your back up recovery codes. Please keep them in a safe place!",
  type: "info",
}

describe("IntlProvider", () => {
  test("should return the german locale", () => {
    renderWithComponents(
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
    renderWithComponents(
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
