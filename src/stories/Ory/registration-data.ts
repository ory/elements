// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RegistrationFlow } from "@ory/client"

export const registrationFlow: RegistrationFlow = {
  id: "c9dd6996-b5f9-4255-ba49-5ed0e13b1b9a",
  type: "browser",
  expires_at: "2022-08-05T11:13:15.502149013Z",
  issued_at: "2022-08-05T10:43:15.502149013Z",
  request_url:
    "http://project.console.ory.sh/self-service/registration/browser",
  ui: {
    action:
      "https://project.console.ory.sh/self-service/registration?flow=c9dd6996-b5f9-4255-ba49-5ed0e13b1b9a",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "tFdjiYdn6IgyeoiDfN7AGRgDX2AzcwhcJl4emCXMKo3ciO6e5FxI9MDvRov1yWUtA07pe6dYa/yejFY72+ktsQ==",
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
          value: "github",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1040002,
            text: "Sign up with github",
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
            id: 1040002,
            text: "Sign up with google",
            type: "info",
            context: {
              provider: "google",
            },
          },
        },
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
            text: "Email address",
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
          name: "traits.name",
          type: "text",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "Name",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "traits.consent.newsletter",
          type: "checkbox",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "Please inform me about platform and security updates",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "traits.consent.tos",
          type: "datetime-local",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1070002,
            text: "I accept the Terms of Service https://www.ory.sh/ptos",
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
  state: "",
}

export const registrationWebAuthnFlow: RegistrationFlow = {
  id: "a4535906-1c4b-4b4a-b84e-8246b756dffe",
  type: "browser",
  expires_at: "2022-08-22T14:39:46.330928Z",
  issued_at: "2022-08-22T14:09:46.330928Z",
  request_url:
    "http://project.console.ory.sh/self-service/registration/browser?return_to=",
  ui: {
    action:
      "http://project.console.ory.sh/self-service/registration?flow=a4535906-1c4b-4b4a-b84e-8246b756dffe",
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
            "f5EgWzcuFMVn0hSuGmotWjJntG1VRIWHzRdpqOfNucu+JJempBB0+ivjTG6iR50mV1ScEpwoshFF0pe/nESywA==",
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
            'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"s=","rp":{"name":"Personal","id":"some-slug.projects.oryapis.com"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":"=="},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"userVerification":"discouraged"},"timeout":60000}})',
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
          src: "http://project.console.ory.sh/.well-known/ory/webauthn.js",
          async: true,
          referrerpolicy: "no-referrer",
          crossorigin: "anonymous",
          integrity:
            "sha512-E3ctShTQEYTkfWrjztRCbP77lN7L0jJC2IOd6j8vqUKslvqhX/Ho3QxlQJIeTI78krzAWUQlDXd9JQ0PZlKhzQ==",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "107c6218-7cc9-4533-917d-57ccc3cf90c6",
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
            id: 1040001,
            text: "Sign up",
            type: "info",
            context: {},
          },
        },
      },
    ],
  },
  state: "",
}

export const registrationFlowCode: RegistrationFlow = {
  id: "4028e642-a1a2-4ab7-b8b8-0b8683216f16",
  type: "browser",
  expires_at: "2023-09-15T06:51:15.085031Z",
  issued_at: "2023-09-15T06:21:15.085031Z",
  request_url:
    "https://example.com/self-service/registration/browser?return_to=",
  ui: {
    action:
      "https://example.com/self-service/registration?flow=4028e642-a1a2-4ab7-b8b8-0b8683216f16",
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
            context: {
              title: "E-Mail",
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
            "AYWGaOmwWvetqDidhkfq2nJxD9IFITJ4Czi6MPbRLO5LCNKhJpvX8TF5XsF2L7Sk0YNhAbPYFCiwPbdL8P3lxw==",
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
            'window.__oryWebAuthnRegistration({"publicKey":{"rp":{"name":"Test","id":"example.com"},"user":{"name":"Test","displayName":"Test","id":"rhD-u3guQBaDPkwrIbBISQ"},"challenge":"PwDL5hQ-H9fsxdurVLe5gisJ8-","pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"timeout":300000,"authenticatorSelection":{"requireResidentKey":false,"userVerification":"discouraged"}}})',
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
          src: "https://example.com/.well-known/ory/webauthn.js",
          async: true,
          referrerpolicy: "no-referrer",
          crossorigin: "anonymous",
          integrity:
            "sha512-RI23aG5lwYTo7zknGdc++eHUMimUWhkyFzrGid6HkVSdUSjdESPtM3KufXGq/lo4Ut0jI9mDiZeT8tHoSvaHvg==",
          type: "text/javascript",
          id: "webauthn_script",
          nonce: "94a13785-1ae3-4560-8a87-09d24f7b36bb",
          node_type: "script",
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
        meta: {
          label: {
            id: 1040006,
            text: "Sign up with code",
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
            id: 1040001,
            text: "Sign up",
            type: "info",
          },
        },
      },
    ],
  },
  state: "choose_method",
}
