// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { screen } from "@testing-library/dom"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { Node } from "../node"

test("Text nodes are translated to german", () => {
  renderWithOryElements(
    <IntlProvider locale="de">
      <Node
        node={{
          attributes: {
            id: "totp_secret_key",
            node_type: "text",
            text: {
              context: {},
              id: 1050006,
              type: "info",
              text: "XXXXXX",
            },
          },
          group: "totp",
          messages: [],
          meta: {
            label: {
              id: 1050017,
              text: "This is your authenticator app secret. Use it if you can not scan the QR code.",
              type: "info",
            },
          },
          type: "text",
        }}
      />
    </IntlProvider>,
  )

  expect(
    screen.getByText(
      "Dies ist Ihr Authentifizierungs-App-Geheimnis. Verwenden Sie es, wenn Sie den QR-Code nicht scannen können.",
    ),
  ).toBeTruthy()
  expect(
    screen.getByTestId("ory/form/node/input/totp_secret_key"),
  ).toBeVisible()
  expect(screen.getByTestId("ory/form/node/input/totp_secret_key")).toHaveValue(
    "XXXXXX",
  )
})

test("Rendering lookup_secret_codes text node throws error", () => {
  expect(() =>
    renderWithOryElements(
      <IntlProvider locale="de">
        <Node
          node={{
            attributes: {
              id: "lookup_secret_codes",
              node_type: "text",
              text: {
                context: {
                  secrets: [{ text: "code1" }, { text: "code2" }],
                },
                id: 1050020,
                type: "info",
                text: "These are your recovery codes. Store them safely!",
              },
            },
            group: "lookup_secret",
            messages: [],
            meta: {},
            type: "text",
          }}
        />
      </IntlProvider>,
    ),
  ).toThrow("node `lookup_secret_codes` cannot be rendered as text")
})
