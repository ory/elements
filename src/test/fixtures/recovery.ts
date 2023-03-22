// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { GenericError, RecoveryFlow } from "@ory/client"
import { ErrorBrowserLocationChangeRequired } from "@ory/elements-test"

export const recoverySubmitEmailFixture: RecoveryFlow = {
  id: "ccd0d54c-ebc2-408c-ae7e-97d96dae832b",
  type: "browser",
  expires_at: "2023-03-21T07:55:14.102072Z",
  issued_at: "2023-03-21T07:25:14.102072Z",
  request_url: "http://localhost:4000/self-service/recovery/browser",
  active: "code",
  ui: {
    action:
      "http://localhost:4000/self-service/recovery?flow=ccd0d54c-ebc2-408c-ae7e-97d96dae832b",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "YE0J2zNLlx/GnvYeJ/G6cRrd9BLccwMt+Jn+9bkUWKU0JGh8V/lVZwD5PWBbs33za8UJ9UOJcKpxR2enhW1g3A==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "code",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070006, text: "Verify code", type: "info" } },
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "method",
          type: "hidden",
          value: "code",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "method",
          type: "submit",
          value: "code",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070005, text: "Submit", type: "info" } },
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "email",
          type: "submit",
          value: "example@example.com",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070008, text: "Resend code", type: "info" } },
      },
    ],
    messages: [
      {
        id: 1060003,
        text: "An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
        type: "info",
        context: {},
      },
    ],
  },
  state: "sent_email",
}

export const recoverySubmitCodeFixture: Omit<
  ErrorBrowserLocationChangeRequired,
  "message"
> & {
  error: GenericError
} = {
  error: {
    id: "browser_location_change_required",
    code: 422,
    status: "Unprocessable Entity",
    reason:
      "In order to complete this flow please redirect the browser to: /ui/settings?flow=22b3ad6f-c50a-4c2f-8c94-a16e9dc20083",
    message: "browser location change required",
  },
  redirect_browser_to: "/ui/settings?flow=22b3ad6f-c50a-4c2f-8c94-a16e9dc20083",
}

export const recoveryFixture: RecoveryFlow = {
  id: "5c857a5a-6a21-48cb-9acd-da9b81c1ed13",
  state: "choose_method",
  type: "browser",
  request_url: "https://localhost:4000",
  ui: {
    action:
      "https://localhost:4000/self-service/recovery?flow=5c857a5a-6a21-48cb-9acd-da9b81c1ed13",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "",
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
  issued_at: "2022-08-22T22:02:15.825471Z",
  expires_at: "2022-08-22T22:02:15.825471Z",
}
