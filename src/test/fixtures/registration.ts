// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RegistrationFlow } from "@ory/client"

export const registrationFixture: RegistrationFlow = {
  id: "1c09e31f-fb4c-4eac-8f17-ec7ae01cab97",
  type: "browser",
  expires_at: "2022-08-29T10:19:47.350346654Z",
  issued_at: "2022-08-29T09:49:47.350346654Z",
  request_url: "http://localhost:4000/self-service/registration/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/registration?flow=1c09e31f-fb4c-4eac-8f17-ec7ae01cab97",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "uWnnuBgYQAXyeCuZ+c6aBNfj55zPo+0ACTcp+rzrIcQ9VurmCXnaw9xggOde9S+DSjPnjXqpa2RKTBAlLmKG+A==",
          required: true,
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
          name: "traits.email",
          type: "email",
          required: true,
          autocomplete: "email",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "E-Mail",
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
          autocomplete: "new-password",
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
          name: "traits.firstName",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "First Name",
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
            id: 1040001,
            text: "Sign up",
            type: "info",
            context: {},
          },
        },
      },
    ],
  },
}

export const registrationNoneFixture: RegistrationFlow = {
  id: "d045d585-0813-45fe-bb91-ef8d44e39dc9",
  type: "browser",
  expires_at: "2022-08-29T10:16:42.581562361Z",
  issued_at: "2022-08-29T09:46:42.581562361Z",
  request_url: "http://localhost:4000/self-service/registration/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/registration?flow=d045d585-0813-45fe-bb91-ef8d44e39dc9",
    method: "POST",
    nodes: [],
  },
}

export const registrationSubmitDuplicateAccountFixture: RegistrationFlow = {
  id: "cabee281-f75c-4239-8014-10bbdfdcede4",
  oauth2_login_challenge: null,
  type: "browser",
  expires_at: "2023-03-20T15:46:54.152799Z",
  issued_at: "2023-03-20T15:16:54.152799Z",
  request_url: "https://localhost:4000/self-service/registration/browser",
  ui: {
    action:
      "https://localhost:4000/self-service/registration?flow=cabee281-f75c-4239-8014-10bbdfdcede4",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "traits.email",
          type: "email",
          required: true,
          autocomplete: "email",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070002, text: "E-Mail", type: "info" } },
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "traits.tos",
          type: "checkbox",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: { label: { id: 1070002, text: "Accept Tos", type: "info" } },
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "vmmwe7f2wCUjNFSqDzb+yDekr0u+FsvPswxHjhCjC4DlqgNkOStsL/nzCfMsxImixjB+t/VpkG/+GcrA0p2yRA==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
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
            id: 1040002,
            text: "Sign up with Discord",
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
            id: 1040002,
            text: "Sign up with Facebook",
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
            id: 1040002,
            text: "Sign up with GitHub",
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
            id: 1040002,
            text: "Sign up with Google",
            type: "info",
            context: { provider: "Google" },
          },
        },
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "webauthn_register_displayname",
          type: "text",
          value: "",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050013,
            text: "Name of the security key",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "webauthn_register",
          type: "hidden",
          value: "",
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
          name: "webauthn_register_trigger",
          type: "button",
          value: "",
          disabled: false,
          onclick:
            'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"/rIbvxaP8Yrcs7Dk4lLvgVFydqZpIq6OOuHjkUJzhho=","rp":{"name":"","id":"example.com"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":"DUx1NdG4RyKx41vpmWmYJA=="},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"userVerification":"discouraged"},"timeout":60000}})',
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1040004,
            text: "Sign up with security key",
            type: "info",
          },
        },
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
            "sha512-8GWpMHzEByiefeXeZNxg1k16eFoSoff1mQVa4vUUruBughTU/Yt4WGl7yteMa11UgygiMEbH8Xn1oKxh8PbkiA==",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "1331af6d-20e0-4775-b5b9-b93d502ff8f7",
          node_type: "script",
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
          autocomplete: "new-password",
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
          label: { id: 1040001, text: "Sign up", type: "info", context: {} },
        },
      },
    ],
    messages: [
      {
        id: 4000007,
        text: "An account with the same identifier (email, phone, username, ...) exists already.",
        type: "error",
        context: {},
      },
    ],
  },
}

export const registrationPasswordlessFixture: RegistrationFlow = {
  id: "e8cc19c1-66f1-4c22-8099-66126a420353",
  type: "browser",
  expires_at: "2022-08-29T10:12:12.731545764Z",
  issued_at: "2022-08-29T09:42:12.731545764Z",
  request_url: "http://localhost:4000/self-service/registration/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/registration?flow=e8cc19c1-66f1-4c22-8099-66126a420353",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "traits.email",
          type: "email",
          required: true,
          autocomplete: "email",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "E-Mail",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "default",
        attributes: {
          name: "traits.firstName",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "First Name",
            type: "info",
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
            "h37vdPr40Oc/jJJuh7Hi97MFYkITgp5eU51UP34qG3kDQeIq65lKIRGUORAgildwLtViU6aIGDoQ5m3g7KO8RQ==",
          required: true,
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
          name: "webauthn_register_displayname",
          type: "text",
          value: "",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050013,
            text: "Name of the security key",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "webauthn",
        attributes: {
          name: "webauthn_register",
          type: "hidden",
          value: "",
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
          name: "webauthn_register_trigger",
          type: "button",
          value: "",
          disabled: false,
          onclick:
            'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"","rp":{"name":"Test","id":"localhost:4000"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":"xY1S9EHMQyGB3+MTZRt5jA=="},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"userVerification":"discouraged"},"timeout":60000}})',
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1040004,
            text: "Sign up with security key",
            type: "info",
          },
        },
      },
      {
        type: "script",
        group: "webauthn",
        attributes: {
          src: "http://localhost:4000/.well-known/ory/webauthn.js",
          async: true,
          referrerpolicy: "no-referrer",
          crossorigin: "anonymous",
          integrity: "",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "378c397a-1803-4d04-9dfb-33e575bd6942",
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
    ],
  },
}

export const registrationCodeFixture: RegistrationFlow = {
  id: "1c09e31f-fb4c-4eac-8f17-ec7ae01cab97",
  type: "browser",
  expires_at: "2022-08-29T10:19:47.350346654Z",
  issued_at: "2022-08-29T09:49:47.350346654Z",
  request_url: "http://localhost:4000/self-service/registration/browser",
  ui: {
    action:
      "http://localhost:4000/self-service/registration?flow=1c09e31f-fb4c-4eac-8f17-ec7ae01cab97",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "uWnnuBgYQAXyeCuZ+c6aBNfj55zPo+0ACTcp+rzrIcQ9VurmCXnaw9xggOde9S+DSjPnjXqpa2RKTBAlLmKG+A==",
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
          name: "traits.email",
          type: "email",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "E-Mail",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "traits.firstName",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "First Name",
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
            id: 1040006,
            text: "Sign up with code",
            type: "info",
          },
        },
      },
    ],
  },
}
