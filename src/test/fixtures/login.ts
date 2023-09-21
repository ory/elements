// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow } from "@ory/client"

export const loginFixture: LoginFlow = {
  id: "31f9170d-c28d-4f6c-8cf8-54b999a4f172",
  type: "browser",
  expires_at: "2022-08-29T10:21:13.298704656Z",
  issued_at: "2022-08-29T09:51:13.298704656Z",
  request_url: "http://localhost:4000/self-service/login/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/login?flow=31f9170d-c28d-4f6c-8cf8-54b999a4f172",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "gRBwj0LpxhDugD8sNq1/H6HABvVKMoZepLuLHU+7leIFL33RU4hc1sCYlFKRlsqYPBAG5P84ADrnwLLC3TIy3g==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "text",
          value: "",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070004,
            text: "ID",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          required: true,
          autocomplete: "current-password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070001,
            text: "Password",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010001,
            text: "Sign in",
            type: "info",
            context: {},
          },
        },
      },
    ],
  },
  created_at: "2022-08-29T09:51:13.308547Z",
  updated_at: "2022-08-29T09:51:13.308547Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginNoneFixture: LoginFlow = {
  id: "62a8739b-5866-4a4c-9951-acb39a49709c",
  type: "browser",
  expires_at: "2022-08-29T10:17:27.87015684Z",
  issued_at: "2022-08-29T09:47:27.87015684Z",
  request_url: "http://localhost:4000/self-service/login/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/login?flow=62a8739b-5866-4a4c-9951-acb39a49709c",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "FFydsmckUnGEN4NMGn5uuW1TTy0XNTd1YrAIS6szdbuQY5DsdkXIt6ovKDK9Rds+8INPPKI/sREhyzGUObrShw==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
    ],
  },
  created_at: "2022-08-29T09:47:27.876079Z",
  updated_at: "2022-08-29T09:47:27.876079Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginRefreshFixture: LoginFlow = {
  id: "8a23a143-c08d-4635-b9fc-f9036db53227",
  oauth2_login_challenge: "",
  type: "browser",
  expires_at: "2023-01-09T14:00:47.355708383Z",
  issued_at: "2023-01-09T13:00:47.355708383Z",
  request_url: "http://localhost:4000/self-service/login/browser?refresh=true",
  ui: {
    action:
      "http://localhost:4000/self-service/login?flow=8a23a143-c08d-4635-b9fc-f9036db53227",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "Uw3zN207hJcnQgQMqipxgHLmmaua3afaJKrTHDbUpjKXdlBe7QAJpL/ZVp7AClu6zDBhvfnh5JXsHxiXlDmyhA==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "hidden",
          value: "johndoe@acme.com",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          required: true,
          autocomplete: "current-password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070001,
            text: "Password",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010001,
            text: "Sign in",
            type: "info",
            context: {},
          },
        },
      },
    ],
    messages: [
      {
        id: 1010003,
        text: "Please confirm this action by verifying that it is you.",
        type: "info",
        context: {},
      },
    ],
  },
  created_at: "2023-01-09T13:00:47.48922Z",
  updated_at: "2023-01-09T13:00:47.48922Z",
  refresh: true,
  requested_aal: "aal1",
  state: "",
}

export const loginSubmitIncorrectCredentialsFixture: LoginFlow = {
  id: "400c0e81-16ba-4c1c-a6e1-ab1eac2bd413",
  oauth2_login_challenge: "",
  type: "browser",
  expires_at: "2023-03-16T12:49:22.219258Z",
  issued_at: "2023-03-16T12:19:22.219258Z",
  request_url:
    "https://localhost:4000/self-service/login/browser?refresh=true&aal=aal1",
  ui: {
    action:
      "https://localhost:4000/self-service/login?flow=400c0e81-16ba-4c1c-a6e1-ab1eac2bd413",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "oidc",
        attributes: {
          name: "provider",
          type: "submit",
          value: "discord",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010002,
            text: "Sign in with Discord",
            type: "info",
            context: { provider: "Discord" },
          },
        },
      },
      {
        type: "input",
        group: "oidc",
        attributes: {
          name: "provider",
          type: "submit",
          value: "facebook",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010002,
            text: "Sign in with Facebook",
            type: "info",
            context: { provider: "Facebook" },
          },
        },
      },
      {
        type: "input",
        group: "oidc",
        attributes: {
          name: "provider",
          type: "submit",
          value: "github",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010002,
            text: "Sign in with GitHub",
            type: "info",
            context: { provider: "GitHub" },
          },
        },
      },
      {
        type: "input",
        group: "oidc",
        attributes: {
          name: "provider",
          type: "submit",
          value: "google",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010002,
            text: "Sign in with Google",
            type: "info",
            context: { provider: "Google" },
          },
        },
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "Tj03XA71hPNteczHS2gPV5r+Bwo9BVwrO8m3l8bMG/erq0Ea8SBnlU53ndj14MGiwUcp52socpZliGL7YpbUow==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "text",
          value: "asdasfew@fwefwe.com",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070004, text: "ID", type: "info" } },
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "method",
          type: "submit",
          value: "webauthn",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010001,
            text: "Sign in with security key",
            type: "info",
            context: {},
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          required: true,
          autocomplete: "current-password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070001, text: "Password", type: "info" } },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: { id: 1010001, text: "Sign in", type: "info", context: {} },
        },
      },
    ],
    messages: [
      {
        id: 4000006,
        text: "The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.",
        type: "error",
        context: {},
      },
    ],
  },
  created_at: "2023-03-16T12:19:22.331239Z",
  updated_at: "2023-03-16T12:19:22.331239Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginTwoFactorFixture: LoginFlow = {
  id: "3f9319a6-7105-4004-aa16-80d3f5281164",
  type: "browser",
  expires_at: "2022-09-22T15:59:26.051983Z",
  issued_at: "2022-09-22T15:29:26.051983Z",
  request_url: "https://localhost:4000/self-service/login/browser?aal=aal2",
  ui: {
    action:
      "https://localhost:4000/self-service/login?flow=3f9319a6-7105-4004-aa16-80d3f5281164",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "sylBsTLGrttAzMQtXZtb+Cpk4K/Pe9P+vz2WBUJoLunc8h5ff/7aloMMy/vJsnp/IwojlWaAfnuAwaqA5+i+Lg==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "hidden",
          value: "aecaf2bf-b33f-4271-9c4d-0c0eb722fcf8",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "webauthn_login_trigger",
          type: "button",
          value: "",
          disabled: false,
          onclick:
            'window.__oryWebAuthnLogin({"publicKey":{"challenge":"zk6j9Qfetb7N3DIZflBKrTSQvXwwAAw1/HFliAXJOR0=","timeout":60000,"rpId":"localhost:4000","allowCredentials":[{"type":"public-key","id":"jeuNGRy/jfYfxNhZ8JvfCy/dE5gs5m1djdMrtRb+Tuwq9tgP+U1o6JR8BWrt7oLWHQbxnh0t3Ebu1EtTKzwJbw=="}],"userVerification":"discouraged"}})',
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010008,
            text: "Use security key",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "webauthn_login",
          type: "hidden",
          value: "",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "script",
        group: "webauthn",
        attributes: {
          src: "https://localhost:4000/.well-known/ory/webauthn.js",
          async: true,
          referrerpolicy: "no-referrer",
          crossorigin: "anonymous",
          integrity:
            "sha512-E3ctShTQEYTkfWrjztRCbP77lN7L0jJC2IOd6j8vqUKslvqhX/Ho3QxlQJIeTI78krzAWUQlDXd9JQ0PZlKhzQ==",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "c3c7199e-8a94-4878-b5ac-dddbfd94029e",
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "totp",
        attributes: {
          name: "totp_code",
          type: "text",
          value: "",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010006,
            text: "Authentication code",
            type: "info",
            context: {},
          },
        },
      },
      {
        type: "input",
        group: "totp",
        attributes: {
          name: "method",
          type: "submit",
          value: "totp",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010009,
            text: "Use Authenticator",
            type: "info",
            context: {},
          },
        },
      },
    ],
    messages: [
      {
        id: 1010004,
        text: "Please complete the second authentication challenge.",
        type: "info",
        context: {},
      },
    ],
  },
  created_at: "2022-09-22T15:29:26.311469Z",
  updated_at: "2022-09-22T15:29:26.311469Z",
  refresh: false,
  requested_aal: "aal2",
  state: "",
}

export const loginPasswordlessFixture: LoginFlow = {
  id: "13de599b-5fc0-472c-9635-b1d19c0ea9e3",
  type: "browser",
  expires_at: "2022-08-29T10:22:39.093619222Z",
  issued_at: "2022-08-29T09:52:39.093619222Z",
  request_url: "http://localhost:4000/self-service/login/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/login?flow=13de599b-5fc0-472c-9635-b1d19c0ea9e3",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "ze0GFCqJ9j8C+ePPezAZl1j/Hu+7BKPXX8wxAe/Ky1xJ0gtKO+hs+SzhSLHcC6wQxS8e/g4OJbMctwjefUNsYA==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "text",
          value: "",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070004,
            text: "ID",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "method",
          type: "submit",
          value: "webauthn",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010001,
            text: "Sign in with security key",
            type: "info",
            context: {},
          },
        },
      },
    ],
  },
  created_at: "2022-08-29T09:52:39.101785Z",
  updated_at: "2022-08-29T09:52:39.101785Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginCodeFixture: LoginFlow = {
  id: "abee8b51-4e39-4d0a-9ac7-64ff0ff6c502",
  type: "browser",
  expires_at: "2023-08-22T07:02:40.795179386Z",
  issued_at: "2023-08-22T06:02:40.795179386Z",
  request_url: "http://localhost:4433/self-service/login/browser",
  ui: {
    action:
      "http://localhost:4455/self-service/login?flow=abee8b51-4e39-4d0a-9ac7-64ff0ff6c502",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "oh1/UgG2XUnGqK/GrmaAd2KPV5H2t6fQsQd5GXBPeIRJUZ5Bs5ViBMcLw3+Ydf1E5dKBNnLLf1GpTvhbSnWtoQ==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070004,
            text: "ID",
            type: "info",
          },
        },
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
        meta: {
          label: {
            id: 1010015,
            text: "Sign in with code",
            type: "info",
          },
        },
      },
    ],
  },
  created_at: "2023-08-22T08:02:40.797052+02:00",
  updated_at: "2023-08-22T08:02:40.797052+02:00",
  refresh: false,
  requested_aal: "aal1",
  state: "choose_method",
}

export const loginCodeTwoFixture: LoginFlow = {
  id: "2b739b09-4d06-4489-9895-6b8a55634ff6",
  type: "browser",
  expires_at: "2023-08-22T07:13:25.194774403Z",
  issued_at: "2023-08-22T06:13:25.194774403Z",
  request_url: "http://localhost:4433/self-service/login/browser",
  active: "code",
  ui: {
    action:
      "http://localhost:4455/self-service/login?flow=2b739b09-4d06-4489-9895-6b8a55634ff6",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "8oV4sZaVTX6Ho1+UdshHlsAA4fRkBcuaqLVGT2hWaaufINifEbCGaQ/emgdUiHp833a2duHjCv3axZ9907alzw==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "text",
          value: "example@example.com",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070004,
            text: "ID",
            type: "info",
          },
        },
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
          name: "code",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070013,
            text: "Login code",
            type: "info",
          },
        },
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
        meta: {
          label: {
            id: 1070005,
            text: "Submit",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "resend",
          type: "submit",
          value: "code",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070008,
            text: "Resend code",
            type: "info",
          },
        },
      },
    ],
    messages: [
      {
        id: 1010014,
        text: "An email containing a code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and retry the login.",
        type: "info",
        context: {},
      },
    ],
  },
  created_at: "2023-08-22T08:13:25.196412+02:00",
  updated_at: "2023-08-22T08:13:25.196412+02:00",
  refresh: false,
  requested_aal: "aal1",
  state: "sent_email",
}

export const loginFixtureOAuth2: LoginFlow = {
  id: "31f9170d-c28d-4f6c-8cf8-54b999a4f172",
  type: "browser",
  oauth2_login_request: {
    client: {
      client_id: "oauth2-login-client",
      client_uri: "https://www.ory.sh/docs/ecosystem/sdks",
    },
    challenge: "a1b2c3d4e5f6g7h8i9j0",
    request_url: "http://localhost:4000/self-service/login/browser",
    requested_access_token_audience: ["https://api.ory.sh/"],
    requested_scope: ["offline", "openid"],
    skip: false,
    subject: "",
  },
  expires_at: "2022-08-29T10:21:13.298704656Z",
  issued_at: "2022-08-29T09:51:13.298704656Z",
  request_url: "http://localhost:4000/self-service/login/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/login?flow=31f9170d-c28d-4f6c-8cf8-54b999a4f172",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "gRBwj0LpxhDugD8sNq1/H6HABvVKMoZepLuLHU+7leIFL33RU4hc1sCYlFKRlsqYPBAG5P84ADrnwLLC3TIy3g==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "identifier",
          type: "text",
          value: "",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070004,
            text: "ID",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          required: true,
          autocomplete: "current-password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070001,
            text: "Password",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1010001,
            text: "Sign in",
            type: "info",
            context: {},
          },
        },
      },
    ],
  },
  created_at: "2022-08-29T09:51:13.308547Z",
  updated_at: "2022-08-29T09:51:13.308547Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}
