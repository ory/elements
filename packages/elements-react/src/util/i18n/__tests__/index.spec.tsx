import { IntlProvider } from "../../../context/intl-context"
import { UiText } from "@ory/client-fetch"
import { expect, test } from "@playwright/experimental-ct-react"
import { Inner } from "./test-components"

test.use({ viewport: { width: 500, height: 500 } })

const uiText: UiText = {
  id: 1050010,
  text: "These are your back up recovery codes. Please keep them in a safe place!",
  type: "info",
}

test.describe("IntlProvider", () => {
  test("should return the german locale", async ({ mount }) => {
    const component = await mount(
      <IntlProvider locale={"de"}>
        <Inner uiText={uiText} />
      </IntlProvider>,
    )

    await expect(component).toContainText(
      "Dies sind Ihre Backup-Wiederherstellungscode. Bewahren Sie sie an einem sicheren Ort auf!",
    )
  })

  test("should return the polish locale", async ({ mount }) => {
    const component = await mount(
      <IntlProvider locale={"pl"}>
        <Inner uiText={uiText} />
      </IntlProvider>,
    )

    await expect(component).toContainText(
      "To są Twoje zapasowe kody odzyskiwania. Trzymaj je w bezpiecznym miejscu!",
    )
  })
})
