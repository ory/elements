// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { VerificationFlow } from "@ory/client"

export const verificationSubmitEmailFixture: VerificationFlow = {
  id: "62032417-d78a-4282-b735-79e4f471df0e",
  type: "browser",
  expires_at: "2023-03-16T13:37:46.821552Z",
  issued_at: "2023-03-16T13:07:46.821552Z",
  request_url: "https://localhost:4000/self-service/verification/browser",
  active: "code",
  ui: {
    action:
      "https://localhost:4000/self-service/verification?flow=62032417-d78a-4282-b735-79e4f471df0e",
    method: "POST",
    nodes: [
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
          value: "sdfwetrq2r@sdfasdfwqef",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070008, text: "Resend code", type: "info" } },
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "+Qx9HfyNOqHx1gHU9uWMxfhS/J0x9NzW2qq1cq1+DBocmgtbA1jZx9LYUMtIbUIwo+vScGfZ8muE62AeCSTDTg==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ],
    messages: [
      {
        id: 1080003,
        text: "An email containing a verification code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
        type: "info",
        context: {},
      },
    ],
  },
  state: "sent_email",
}

export const verificationSubmitCodeFixture: VerificationFlow = {
  id: "b800d5a7-9199-43a2-a8c6-068c1caac0cd",
  type: "browser",
  expires_at: "2023-03-16T14:54:40.201568Z",
  issued_at: "2023-03-16T14:24:40.201568Z",
  request_url: "https://localhost:4000/self-service/verification/browser",
  active: "code",
  ui: {
    action: "https://localhost:4000/",
    method: "GET",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "Ql2fapJ/hpjARJeaMH6tQaCKJww9E5xxjIAhHKMDw+2ny+ksbapl/uNKxoWO9mO0+zMJ4Ws+sszSwfRwB1kMuQ==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "a",
        group: "code",
        attributes: {
          href: "https://localhost:4000/",
          title: { id: 1070009, text: "Continue", type: "info" },
          id: "continue",
          node_type: "a",
        },
        messages: [],
        meta: { label: { id: 1070009, text: "Continue", type: "info" } },
      },
    ],
    messages: [
      {
        id: 1080002,
        text: "You successfully verified your email address.",
        type: "success",
      },
    ],
  },
  state: "passed_challenge",
}

export const verificationFixture: VerificationFlow = {
  id: "5c857a5a-6a21-48cb-9acd-da9b81c1ed13",
  state: "choose_method",
  type: "browser",
  request_url: "https://localhost:4000",
  ui: {
    action:
      "https://localhost:4000/self-service/verification?flow=5c857a5a-6a21-48cb-9acd-da9b81c1ed13",
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
