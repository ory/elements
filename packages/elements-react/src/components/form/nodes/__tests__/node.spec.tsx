// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { screen } from "@testing-library/dom"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithComponents } from "../../../../tests/jest/test-utils"
import { Node } from "../node"

test("Text nodes are translated to german", () => {
  renderWithComponents(
    <IntlProvider locale="de">
      <Node
        node={{
          type: "text",
          group: "lookup_secret",
          attributes: {
            text: {
              id: 1050015,
              text: "3r9noma8, tv14n5tu",
              type: "info",
              context: {
                secrets: [
                  {
                    context: {
                      secret: "3r9noma8",
                    },
                    id: 1050009,
                    text: "3r9noma8",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "tv14n5tu",
                    },
                    id: 1050009,
                    text: "tv14n5tu",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "te45pbc0",
                    },
                    id: 1050009,
                    text: "te45pbc0",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "juuri7u3",
                    },
                    id: 1050009,
                    text: "juuri7u3",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "zp8df6fe",
                    },
                    id: 1050009,
                    text: "zp8df6fe",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "dhxbkfmv",
                    },
                    id: 1050009,
                    text: "dhxbkfmv",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "rwu6svpj",
                    },
                    id: 1050009,
                    text: "rwu6svpj",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "evv9pedj",
                    },
                    id: 1050009,
                    text: "evv9pedj",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "v37k7nxv",
                    },
                    id: 1050009,
                    text: "v37k7nxv",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "pqhtefs4",
                    },
                    id: 1050009,
                    text: "pqhtefs4",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "mrwstrmp",
                    },
                    id: 1050009,
                    text: "mrwstrmp",
                    type: "info",
                  },
                  {
                    context: {
                      secret: "q3vvtd4i",
                    },
                    id: 1050009,
                    text: "q3vvtd4i",
                    type: "info",
                  },
                ],
              },
            },
            id: "lookup_secret_codes",
            node_type: "text",
          },
          messages: [],
          meta: {
            label: {
              id: 1050010,
              text: "These are your back up recovery codes. Please keep them in a safe place!",
              type: "info",
            },
          },
        }}
      />
    </IntlProvider>,
  )

  expect(
    screen.getByText(
      "Dies sind Ihre Backup-Wiederherstellungscodes. Bewahren Sie diese an einem sicheren Ort auf!",
    ),
  ).toBeTruthy()
  expect(screen.getByText("te45pbc0")).toBeTruthy()
  expect(screen.getByText("q3vvtd4i")).toBeTruthy()
})
