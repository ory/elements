// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { VerificationFlow } from "@ory/client"

export const verificationFlow: VerificationFlow = {
  id: "544adecc-d51f-443a-b5a0-8e57a639bcbf",
  type: "browser",
  expires_at: "2022-08-10T17:31:11.730178932Z",
  issued_at: "2022-08-10T16:31:11.730178932Z",
  request_url:
    "http://project.console.ory.sh/self-service/verification/browser",
  ui: {
    action:
      "https://project.console.ory.sh/self-service/verification?flow=544adecc-d51f-443a-b5a0-8e57a639bcbf",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "Tdt00Dex00zJt+wEPXedaEaBIfyfqyJEP3A1jUnribGgXIPkBMtK6aJcRQm9ajtXjRIKxYWXWnEzrwuReDyhAQ==",
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

export const verificationFlowSubmit: VerificationFlow = {
  id: "e7c97194-e8b3-40bd-bae2-b7d3a982b822",
  type: "browser",
  expires_at: "2022-11-28T11:27:07.404116Z",
  issued_at: "2022-11-28T10:57:07.404116Z",
  request_url: "http://localhost:4000/self-service/verification/browser",
  active: "link",
  ui: {
    action:
      "http://localhost:4000/self-service/verification?flow=e7c97194-e8b3-40bd-bae2-b7d3a982b822",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "80B85aSjnkeic72CfM7KRtRKoLJec+vdOi1q228bvk+/fqPS02zO0Rn4Nd3bqBP6gbfx1vo6CGUwjgDYhfLzFg==",
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
          value: "no-github@test.net",
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
    messages: [
      {
        id: 1080001,
        text: "An email containing a verification link has been sent to the email address you provided.",
        type: "info",
        context: {},
      },
    ],
  },
  state: "sent_email",
}
