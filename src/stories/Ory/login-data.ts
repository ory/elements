// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow } from "@ory/client"

export const loginFlow: LoginFlow = {
  id: "4a7c067f-ae1f-4015-b3e3-74e1de254b40",
  type: "browser",
  expires_at: "2022-08-23T18:50:56.82053129Z",
  issued_at: "2022-08-23T18:20:56.82053129Z",
  request_url: "http://test.com/self-service/login/browser",
  ui: {
    action:
      "http://test.com/self-service/login?flow=4a7c067f-ae1f-4015-b3e3-74e1de254b40",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "6Ov489/mtfsZ9cnFjqsSzxITOj4F6F1DaLTlrznzZtmFNHE9hssysNvRxD6vmbjhxexBYUcJ4HMC14wSREegkg==",
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
            id: 1010008,
            text: "Use security key",
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
  created_at: "2022-08-23T18:20:56.827165Z",
  updated_at: "2022-08-23T18:20:56.827165Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginFlowUiError: LoginFlow = {
  id: "4825164f-0784-4ed3-ba8f-9d0bef2bc3f2",
  type: "browser",
  expires_at: "2022-09-27T12:07:40.581807Z",
  issued_at: "2022-09-27T11:37:40.581807Z",
  request_url:
    "http://test.com/self-service/login/browser?refresh=true&aal=aal1",
  ui: {
    action:
      "http://test.com/self-service/login?flow=4825164f-0784-4ed3-ba8f-9d0bef2bc3f2",
    method: "POST",
    nodes: [
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
            context: {
              provider: "GitHub",
            },
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
            "8sIxbFJwFrHHWTI4rYRfVwGjtbQ/a4z6bf5R+KMW8DBlxNcIO1mBNk7HjsleD/jSadbVlK9CJah2sZo9OrfM9g==",
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
        messages: [
          {
            id: 4000002,
            text: "Property identifier is missing.",
            type: "error",
            context: {
              property: "identifier",
            },
          },
        ],
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
  created_at: "2022-09-27T11:37:40.673019Z",
  updated_at: "2022-09-27T11:37:40.673019Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginFlowRefresh: LoginFlow = {
  id: "8a23a143-c08d-4635-b9fc-f9036db53227",
  oauth2_login_challenge: "",
  type: "browser",
  expires_at: "2023-01-09T14:00:47.355708383Z",
  issued_at: "2023-01-09T13:00:47.355708383Z",
  request_url: "http://test.com/self-service/login/browser?refresh=true",
  ui: {
    action:
      "http://test.com/self-service/login?flow=8a23a143-c08d-4635-b9fc-f9036db53227",
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

export const loginFlowHydra: LoginFlow = {
  id: "4a7c067f-ae1f-4015-b3e3-74e1de254b40",
  type: "browser",
  expires_at: "2022-08-23T18:50:56.82053129Z",
  issued_at: "2022-08-23T18:20:56.82053129Z",
  request_url: "http://test.com/self-service/login/browser",
  oauth2_login_request: {
    client: {
      client_name: "ACME Inc.",
    },
    challenge: "whatever-chanllenge",
    request_url: "https://acme.com",
    requested_scope: ["openid", "offline"],
    requested_access_token_audience: ["https://acme.com"],
    skip: false,
    subject: "user1",
  },
  ui: {
    action:
      "http://test.com/self-service/login?flow=4a7c067f-ae1f-4015-b3e3-74e1de254b40",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "6Ov489/mtfsZ9cnFjqsSzxITOj4F6F1DaLTlrznzZtmFNHE9hssysNvRxD6vmbjhxexBYUcJ4HMC14wSREegkg==",
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
            id: 1010008,
            text: "Use security key",
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
  created_at: "2022-08-23T18:20:56.827165Z",
  updated_at: "2022-08-23T18:20:56.827165Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginFlowError: LoginFlow = {
  id: "e565dc97-17cd-462c-b02a-575cae0073d7",
  type: "browser",
  expires_at: "2022-08-11T09:58:08.397197Z",
  issued_at: "2022-08-11T09:28:08.397197Z",
  request_url:
    "http://project.console.ory.sh/self-service/login/browser?refresh=false",
  ui: {
    action:
      "https://project.console.ory.sh/self-service/login?flow=e565dc97-17cd-462c-b02a-575cae0073d7",
    method: "POST",
    nodes: [
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
            text: "Sign in with github",
            type: "info",
            context: {
              provider: "github",
            },
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
            text: "Sign in with google",
            type: "info",
            context: {
              provider: "google",
            },
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
            "9MLkOckkbh9rK3kgR9qE2GJ5l86+NTRNXXsYwxe91gjhKXtl9aHG1TvNZiaOpwW2ioypjvKPt/KlrUFIRSnCUQ==",
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
          value: "sd@fsd",
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
    messages: [
      {
        id: 4000006,
        text: "The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.",
        type: "error",
        context: {},
      },
    ],
  },
  created_at: "2022-08-11T09:28:08.405977Z",
  updated_at: "2022-08-11T09:28:08.405977Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}

export const loginFlowCodeStepOne: LoginFlow = {
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

export const loginFlowCodeStepTwo: LoginFlow = {
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

export const loginFlowTwoFactor: LoginFlow = {
  id: "0e21a525-6aa7-40e2-8dbf-5fa51f292dc1",
  type: "browser",
  expires_at: "2022-08-22T22:32:15.614434Z",
  issued_at: "2022-08-22T22:02:15.614434Z",
  request_url:
    "http://project.console.ory.sh/self-service/login/browser?aal=aal2",
  ui: {
    action:
      "https://project.console.ory.sh/self-service/login?flow=0e21a525-6aa7-40e2-8dbf-5fa51f292dc1",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "daYqaGczESQOiLZ03a+YgBJC9eo/mHfVl52x4rFnS8gqrH/EoYRdnNT62zDsbHpeDdHvvNLmzxAPN+QBbmDpBw==",
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
            'window.__oryWebAuthnLogin({"publicKey":{"challenge":"=","timeout":60000,"rpId":"console.ory.sh","allowCredentials":[{"type":"public-key","id":"=="}],"userVerification":"discouraged"}})',
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
          src: "https://project.console.ory.sh/.well-known/ory/webauthn.js",
          async: true,
          referrerpolicy: "no-referrer",
          crossorigin: "anonymous",
          integrity:
            "sha512-E3ctShTQEYTkfWrjztRCbP77lN7L0jJC2IOd6j8vqUKslvqhX/Ho3QxlQJIeTI78krzAWUQlDXd9JQ0PZlKhzQ==",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "6d2cacc8-9abd-4f8f-b2b9-cd5250bfa677",
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
  created_at: "2022-08-22T22:02:15.825471Z",
  updated_at: "2022-08-22T22:02:15.825471Z",
  refresh: false,
  requested_aal: "aal2",
  state: "",
}

export const loginFlowWithPasskey: LoginFlow = {
  id: "4a7c067f-ae1f-4015-b3e3-74e1de254b40",
  type: "browser",
  expires_at: "2022-08-23T18:50:56.82053129Z",
  issued_at: "2022-08-23T18:20:56.82053129Z",
  request_url: "http://test.com/self-service/login/browser",
  ui: {
    action:
      "http://test.com/self-service/login?flow=4a7c067f-ae1f-4015-b3e3-74e1de254b40",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "6Ov489/mtfsZ9cnFjqsSzxITOj4F6F1DaLTlrznzZtmFNHE9hssysNvRxD6vmbjhxexBYUcJ4HMC14wSREegkg==",
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
        attributes: {
          disabled: false,
          name: "method",
          node_type: "input",
          type: "submit",
          value: "passkey",
        },
        group: "passkey",
        messages: [],
        meta: {
          label: {
            id: 1040007,
            text: "Sign up with passkey",
            type: "info",
          },
        },
        type: "input",
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
  created_at: "2022-08-23T18:20:56.827165Z",
  updated_at: "2022-08-23T18:20:56.827165Z",
  refresh: false,
  requested_aal: "aal1",
  state: "",
}
