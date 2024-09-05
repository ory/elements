import { IntlProvider } from "../../../context/intl-context"
import { UiText } from "@ory/client-fetch"
import { Inner } from "./test-components"
import { render, screen } from "../../../tests/jest/test-utils"

const uiText: UiText = {
  id: 1050010,
  text: "These are your back up recovery codes. Please keep them in a safe place!",
  type: "info",
}

describe("IntlProvider", () => {
  test("should return the german locale", () => {
    render(
      <IntlProvider locale={"de"}>
        <Inner uiText={uiText} />
      </IntlProvider>,
    )

    expect(
      screen.getByText(
        "Dies sind Ihre Backup-Wiederherstellungscode. Bewahren Sie sie an einem sicheren Ort auf!",
      ),
    ).toBeTruthy()
  })

  test("should return the polish locale", () => {
    render(
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
