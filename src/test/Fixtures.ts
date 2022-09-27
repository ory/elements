import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
} from "@ory/client"

export const loginFixture: SelfServiceLoginFlow = {
  id: "31f9170d-c28d-4f6c-8cf8-54b999a4f172",
  type: "browser",
  expires_at: "2022-08-29T10:21:13.298704656Z",
  issued_at: "2022-08-29T09:51:13.298704656Z",
  request_url: "http://test.com/self-service/login/browser",
  ui: {
    action:
      "http://test.com/self-service/login?flow=31f9170d-c28d-4f6c-8cf8-54b999a4f172",
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
}

export const loginPasswordlessFixture: SelfServiceLoginFlow = {
  id: "13de599b-5fc0-472c-9635-b1d19c0ea9e3",
  type: "browser",
  expires_at: "2022-08-29T10:22:39.093619222Z",
  issued_at: "2022-08-29T09:52:39.093619222Z",
  request_url: "http://test.com/self-service/login/browser",
  ui: {
    action:
      "http://test.com/self-service/login?flow=13de599b-5fc0-472c-9635-b1d19c0ea9e3",
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
}

export const twoFactorLoginFixture: SelfServiceLoginFlow = {
  id: "3f9319a6-7105-4004-aa16-80d3f5281164",
  type: "browser",
  expires_at: "2022-09-22T15:59:26.051983Z",
  issued_at: "2022-09-22T15:29:26.051983Z",
  request_url: "https://test.com/self-service/login/browser?aal=aal2",
  ui: {
    action:
      "https://test.com/self-service/login?flow=3f9319a6-7105-4004-aa16-80d3f5281164",
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
            'window.__oryWebAuthnLogin({"publicKey":{"challenge":"zk6j9Qfetb7N3DIZflBKrTSQvXwwAAw1/HFliAXJOR0=","timeout":60000,"rpId":"test.com","allowCredentials":[{"type":"public-key","id":"jeuNGRy/jfYfxNhZ8JvfCy/dE5gs5m1djdMrtRb+Tuwq9tgP+U1o6JR8BWrt7oLWHQbxnh0t3Ebu1EtTKzwJbw=="}],"userVerification":"discouraged"}})',
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
          src: "https://test.com/.well-known/ory/webauthn.js",
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
}

export const verificationFixture: SelfServiceVerificationFlow = {
  id: "5c857a5a-6a21-48cb-9acd-da9b81c1ed13",
  state: "choose_method",
  type: "browser",
  request_url: "https://test.com",
  ui: {
    action: "https://test.com",
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

export const recoveryFixture: SelfServiceRecoveryFlow = {
  id: "5c857a5a-6a21-48cb-9acd-da9b81c1ed13",
  state: "choose_method",
  type: "browser",
  request_url: "https://test.com",
  ui: {
    action: "https://test.com",
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

export const registrationPasswordlessFixture: SelfServiceRegistrationFlow = {
  id: "e8cc19c1-66f1-4c22-8099-66126a420353",
  type: "browser",
  expires_at: "2022-08-29T10:12:12.731545764Z",
  issued_at: "2022-08-29T09:42:12.731545764Z",
  request_url: "http://test.com/self-service/registration/browser",
  ui: {
    action:
      "http://test.com/self-service/registration?flow=e8cc19c1-66f1-4c22-8099-66126a420353",
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
            'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"","rp":{"name":"Test","id":"test.com"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":"xY1S9EHMQyGB3+MTZRt5jA=="},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"userVerification":"discouraged"},"timeout":60000}})',
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
          src: "http://test.com/.well-known/ory/webauthn.js",
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

export const registrationFixture: SelfServiceRegistrationFlow = {
  id: "1c09e31f-fb4c-4eac-8f17-ec7ae01cab97",
  type: "browser",
  expires_at: "2022-08-29T10:19:47.350346654Z",
  issued_at: "2022-08-29T09:49:47.350346654Z",
  request_url: "http://test.com/self-service/registration/browser",
  ui: {
    action:
      "http://test.com/self-service/registration?flow=1c09e31f-fb4c-4eac-8f17-ec7ae01cab97",
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

export const registrationNoneFixture: SelfServiceRegistrationFlow = {
  id: "d045d585-0813-45fe-bb91-ef8d44e39dc9",
  type: "browser",
  expires_at: "2022-08-29T10:16:42.581562361Z",
  issued_at: "2022-08-29T09:46:42.581562361Z",
  request_url: "http://test.com/self-service/registration/browser",
  ui: {
    action:
      "http://test.com/self-service/registration?flow=d045d585-0813-45fe-bb91-ef8d44e39dc9",
    method: "POST",
    nodes: [],
  },
}

export const loginNoneFixture: SelfServiceLoginFlow = {
  id: "62a8739b-5866-4a4c-9951-acb39a49709c",
  type: "browser",
  expires_at: "2022-08-29T10:17:27.87015684Z",
  issued_at: "2022-08-29T09:47:27.87015684Z",
  request_url: "http://test.com/self-service/login/browser",
  ui: {
    action:
      "http://test.com/self-service/login?flow=62a8739b-5866-4a4c-9951-acb39a49709c",
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
}

export const settingsFixture: SelfServiceSettingsFlow = {
  id: "211d1b28-6144-4b0e-9001-8f73e18c4a82",
  type: "browser",
  expires_at: "2022-08-29T14:09:37.514116692Z",
  issued_at: "2022-08-29T13:39:37.514116692Z",
  request_url: "http://test.com/self-service/settings/browser",
  ui: {
    action:
      "http://test.com/self-service/settings?flow=211d1b28-6144-4b0e-9001-8f73e18c4a82",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "CA1DBzOMYjlLmjKDQ66PUSAPF+9nG+umyOeKvVeM5CLNlXF068/V9nEXNzk6KfXVsPYt4+Y5acxUZwPJW8bzDQ==",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "profile",
        attributes: {
          name: "traits.email",
          type: "email",
          value: "test@test.com",
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
        group: "profile",
        attributes: {
          name: "method",
          type: "submit",
          value: "profile",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070003,
            text: "Save",
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
          name: "method",
          type: "submit",
          value: "password",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070003,
            text: "Save",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "lookup_secret",
        attributes: {
          name: "lookup_secret_regenerate",
          type: "submit",
          value: "true",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050008,
            text: "Generate new backup recovery codes",
            type: "info",
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
            'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"","rp":{"name":"Test","id":"test.com"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":""},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"userVerification":"discouraged"},"timeout":60000}})',
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050012,
            text: "Add security key",
            type: "info",
          },
        },
      },
      {
        type: "script",
        group: "webauthn",
        attributes: {
          src: "http://test.com/.well-known/ory/webauthn.js",
          async: true,
          referrerpolicy: "no-referrer",
          crossorigin: "anonymous",
          integrity:
            "sha512-E3ctShTQEYTkfWrjztRCbP77lN7L0jJC2IOd6j8vqUKslvqhX/Ho3QxlQJIeTI78krzAWUQlDXd9JQ0PZlKhzQ==",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "98844887-ab03-4551-841a-693c5ac802ca",
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
      {
        type: "img",
        group: "totp",
        attributes: {
          src: "data:image/png;base64,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",
          id: "totp_qr",
          width: 256,
          height: 256,
          node_type: "img",
        },
        messages: [],
        meta: {
          label: {
            id: 1050005,
            text: "Authenticator app QR code",
            type: "info",
          },
        },
      },
      {
        type: "text",
        group: "totp",
        attributes: {
          text: {
            id: 1050006,
            text: "AH4EGV22CTLLZ57BJ4CAAICBB5Z3RQNB",
            type: "info",
            context: {
              secret: "AH4EGV22CTLLZ57BJ4CAAICBB5Z3RQNB",
            },
          },
          id: "totp_secret_key",
          node_type: "text",
        },
        messages: [],
        meta: {
          label: {
            id: 1050017,
            text: "This is your authenticator app secret. Use it if you can not scan the QR code.",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "totp",
        attributes: {
          name: "totp_code",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070006,
            text: "Verify code",
            type: "info",
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
            id: 1070003,
            text: "Save",
            type: "info",
          },
        },
      },
    ],
  },
  identity: {
    id: "6ef63ac1-0f07-406f-87ef-ebbc87e5a3f9",
    schema_id: "preset://email",
    schema_url: "http://test.com/schemas/cHJlc2V0Oi8vZW1haWw",
    state: "active",
    state_changed_at: "2022-02-10T13:57:53.668318Z",
    traits: {
      email: "test@test.com",
    },
    verifiable_addresses: [
      {
        id: "3b0f2966-b5d7-4273-b8a0-b07b96c7591b",
        value: "test@test.com",
        verified: false,
        via: "email",
        status: "sent",
        created_at: "2022-02-10T13:57:53.705359Z",
        updated_at: "2022-02-10T13:57:53.705359Z",
      },
    ],
    recovery_addresses: [
      {
        id: "02b54483-8de9-4b7f-ba1d-ebf8a41e74b7",
        value: "test@test.com",
        via: "email",
        created_at: "2022-02-10T13:57:53.712317Z",
        updated_at: "2022-02-10T13:57:53.712317Z",
      },
    ],
    created_at: "2022-02-10T13:57:53.676513Z",
    updated_at: "2022-02-10T13:57:53.676513Z",
  },
  state: "show_form",
}