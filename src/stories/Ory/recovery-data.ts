// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlow } from "@ory/client"

export const recoveryFlow: RecoveryFlow = {
  id: "d1aee690-fc92-456c-b4df-fcc536184d72",
  type: "browser",
  expires_at: "2022-08-10T16:22:14.721210778Z",
  issued_at: "2022-08-10T15:52:14.721210778Z",
  request_url: "http://project.console.ory.sh/self-service/recovery/browser",
  ui: {
    action:
      "https://project.console.ory.sh/self-service/recovery?flow=d1aee690-fc92-456c-b4df-fcc536184d72",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "908s8H/4VNyyLghv9crWHroZ/cu5el1IjQvOP3cQJS4ayNvETILNednFoWJ113AhcYrW8qNGJX2B1PAjRscNng==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "link",
        attributes: {
          name: "email",
          type: "email",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070007,
            text: "Email",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "link",
        attributes: {
          name: "method",
          type: "submit",
          value: "link",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070005,
            text: "Submit",
            type: "info",
          },
        },
      },
    ],
  },
  state: "choose_method",
}
