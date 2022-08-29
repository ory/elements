import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
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
