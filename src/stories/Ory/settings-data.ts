// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlow } from "@ory/client"

export const settingsFlow: SettingsFlow = {
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
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAEAAAAAApiSv5AAAHM0lEQVR4nOydwY4yOQwGl9X//q/8723gYKVt/HXPSlV1GgGdhKEUWUns/Pn79x8B8+9vD0B+FwWAowBwFADOn/efr1eiwSqo7LY8f/b8xH0BbjWqd2/VCDLfI/8bOQPAUQA4CgBHAeD8qV6cB0/z4OTcRzfI6vbbDajmgVz1Pc6vVa2k/38VdR/OAHAUAI4CwFEAOGUQ+Ga+flU9213hmwdP3VCou5Z2HnO6lfOzXTa/kTMAHgWAowBwFADORRD4f2ITSlbvzrdbz2t4m+BuHiymcAaAowBwFACOAsB5JAjsBkCb03ybs4jz0O/cb/e1zdpmCmcAOAoARwHgKACciyDw2ZBkk+ZRfW4eXlanDef9dk8bnlvpsvuNnAHgKAAcBYCjAHDKIDCTg/qmuwU7f63bR8WmvflrFZvAMPUbOQPAUQA4CgBHAeB8BIFPrPplwqNuH5vPdXN457m+m/N/+d/IGQCOAsBRADgKAOe1WcmqmFe8y5wJPPNECZYnRpD/Hs4AcBQAjgLAUQA47TOB8wAtU26lam8+vk3R5vlYzi3Pn82MucYZAI4CwFEAOAoAJ3QmcFO0OV1GOX3Wr2JTuLpqJcM3N7M4A8BRADgKAEcB4FycCewmJ5zfTd+R0V1Luy+l4zyqTLmaTb3Dc8ufOAPAUQA4CgBHAeCUdwdvriR7Ii1jc09I5jbfzajOdMecuY/FGQCPAsBRADgKAKdcCdwUaKmYb/ima/PNR9Vls5VcsVmV/OZ7OAPAUQA4CgBHAeCE7g6er0tt0jy6Y8mcbTyfXtzcNlJ9Ll3v8Grt0BkAjgLAUQA4CgBntR183ybw/FTd/JaO8/juu9ej+z0yK5XVCD5xBoCjAHAUAI4CwHltEj4qMu1lSrpkto3TN3fM/0Pn3nb5zs4AcBQAjgLAUQA4ZRD48fY4OzidKLHZFJ2Hl5m0kfk2+RN1At0OlgIFgKMAcBQATnslcBMOdrlvG3rTyhMFZDZsQl1nADwKAEcB4CgAnPJMYPXafCVrU7rk2e3RTfrLfHv5TXqb/Jvw0hkAjgLAUQA4CgBntRKYDp7Oz2Zano+0YpNEU/V7/lz1RGqj3hkAjgLAUQA4CgCnLBGzyX19s8mv3WTQZlYCUyttp1a6K6nzojf9Wo7OAHAUAI4CwFEAOF8khmRW2jbPpjd8NyN480RouhmpK4FSoABwFACOAsBp1wnclFbZZO4+u5q3abmivyI3beU8ln4fzgBwFACOAsBRADjltXEVmzLKm0LJ3XfndNvLZCCfW74vlaTq7RNnADgKAEcB4CgAnIuVwG5wslndyhSfuW+1bLMtm04vyf8ezgBwFACOAsBRADhlYkh6UzTd3obNmNN93BeGnp/1TKD8oABwFACOAsC5SAwpH1ls2m4Kw5yf6PZxfnbTyqZszHyVM1NJ0RkAjwLAUQA4CgDnNa/cVzYTudjs3PJma3VTqbDbyu9vcFeYHSxHFACOAsBRADgXxaLP7MoUT0kHSpnC1WcyedZdvvk/OwPAUQA4CgBHAeC0i0Vv8nrPzLN0z8WTN7m+m5C4aiVTHDtdY9CVQPlBAeAoABwFgLMqFp0JmeZkztzdtyqZ2fCtesusGH7iDABHAeAoABwFgFOuBFZkavjNg6fzs913z0+kT+7NayWmz2P2g15nADgKAEcB4CgAnLJO4JtMGsW8vcztJedt43m/6RtNzi2fx9d91sQQOaIAcBQAjgLAubgxZBPObEKmagRVH5vL4u7b0t3cmvJE2PiJMwAcBYCjAHAUAM4XK4GbQGkTDm6qCOZX0E5svsc5iO6GnH2cAeAoABwFgKMAcNorgWcyBaQ3xVjmZPKd02kyTxfCcQaAowBwFACOAsC5SAzJlJLenATc3KCRae++6oDVE5szgfPPOQPgUQA4CgBHAeC07w6+78aQTLLI+XObltOlZOYjSOdUmxgiPygAHAWAowBwvrgxZFOwpPu5TStdMif85ucTn8UgUI4oABwFgKMAcG68Ozh9b8ZmLHPSwfG5lcxpyHkajzMAHgWAowBwFADORWJIl2dX6TY1C+ctPxH6ncmsvXomUAoUAI4CwFEAOBclYuacTxGm0zyqJ9J5vd+sr/We2NRATAWfzgBwFACOAsBRADhlYsh8TfC+os3n3uYhZ7ePcyuZcLDb25v0aq0zAB4FgKMAcBQAzkWJmHRIkimj3KW7+nZ+9sz8G82LxWSqDdY4A8BRADgKAEcB4FwEgWk2t368eSIn+Mx8q3Zz+dym0IzXxskRBYCjAHAUAM7DQeC83MrmMrvzExWb83/VmDNX081b6QepzgBwFACOAsBRADjtG0PmdFMcur3N79Ko3t3cCdylG0pmimNX/Z7b+8QZAI4CwFEAOAoAp10nsMsmyLovlSTTW2ZrOn0nSNVKf/PZGQCOAsBRADgKAKe8MUQ4OAPAUQA4CgBHAeAoAJz/AgAA//8vkGhnPTMq/AAAAABJRU5ErkJggg==",
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
      {
        type: "input",
        group: "oidc",
        attributes: {
          name: "link",
          type: "submit",
          value: "discord",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050002,
            text: "Link discord",
            type: "info",
            context: {
              provider: "discord",
            },
          },
        },
      },
      {
        type: "input",
        group: "oidc",
        attributes: {
          name: "link",
          type: "submit",
          value: "facebook",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050002,
            text: "Link facebook",
            type: "info",
            context: {
              provider: "facebook",
            },
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

export const settingsUnlinkFlow: SettingsFlow = {
  id: "70d61f59-6dd1-4a9c-bd8b-6c083ee754d0",
  type: "browser",
  expires_at: "2023-01-30T14:47:47.515584331Z",
  issued_at: "2023-01-30T14:17:47.515584331Z",
  request_url: "https://test.com/self-service/settings/browser",
  ui: {
    action:
      "https://test.com/self-service/settings?flow=70d61f59-6dd1-4a9c-bd8b-6c083ee754d0",
    method: "POST",
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value:
            "fsOwrbkgd8YiW4WUAwMvEgbPX/HXobpvpksPygImng4iqUsAEfIk+/wlSxfe+uq101twfZmT+iDcGc8SuE94Vw==",
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
            text: "Email address",
            type: "info",
          },
        },
      },
      {
        type: "input",
        group: "profile",
        attributes: {
          name: "traits.name",
          type: "text",
          value: "Test User",
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
        group: "profile",
        attributes: {
          name: "traits.consent.newsletter",
          type: "checkbox",
          value: true,
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
        group: "profile",
        attributes: {
          name: "traits.consent.tos",
          type: "datetime-local",
          value: "2021-05-21T12:07:56.420Z",
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
        group: "oidc",
        attributes: {
          name: "unlink",
          type: "submit",
          value: "github",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050003,
            text: "Unlink github",
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
          name: "unlink",
          type: "submit",
          value: "google",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050003,
            text: "Unlink google",
            type: "info",
            context: {
              provider: "google",
            },
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
          name: "webauthn_remove",
          type: "submit",
          value:
            "8deb8d191cbf8df61fc4d859f09bdf0b2fdd13982ce66d5d8dd32bb516fe4eec2af6d80ff94d68e8947c056aedee82d61d06f19e1d2ddc46eed44b532b3c096f",
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050018,
            text: 'Remove security key "YubiKey"',
            type: "info",
            context: {
              added_at: "2022-03-09T11:06:54Z",
              display_name: "YubiKey",
            },
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
          name: "webauthn_register_trigger",
          type: "button",
          value: "",
          disabled: false,
          onclick:
            'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"IUuX7qXMwLOGizNcUx8R7uHy7jssIEU9S/FxvelguHE=","rp":{"name":"Test","id":"test.com"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":"rsryv7N/QnGdTQwOtyL1+A=="},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"userVerification":"discouraged"},"timeout":60000}})',
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
          nonce: "98844887-ab03-4551-841a-693c5ac802ca",
          node_type: "script",
        },
        messages: [],
        meta: {},
      },
      {
        type: "input",
        group: "totp",
        attributes: {
          name: "totp_unlink",
          type: "submit",
          value: "true",
          required: true,
          disabled: false,
          node_type: "input",
        },
        messages: [],
        meta: {
          label: {
            id: 1050004,
            text: "Unlink TOTP Authenticator App",
            type: "info",
          },
        },
      },
    ],
  },
  identity: {
    id: "6ef63ac1-0f07-406f-87ef-ebbc87e5a3f9",
    schema_id:
      "9cadbdf1d6bc5c5c521a1c17ea83648c911c5cd74a14d9e6cc11a5790d1e8639c3524f8a2d35d34f4151d2df10a7b73d19f7bd0f709fd5ace9019e080bbc4df6",
    schema_url:
      "https://test.com/schemas/OWNhZGJkZjFkNmJjNWM1YzUyMWExYzE3ZWE4MzY0OGM5MTFjNWNkNzRhMTRkOWU2Y2MxMWE1NzkwZDFlODYzOWMzNTI0ZjhhMmQzNWQzNGY0MTUxZDJkZjEwYTdiNzNkMTlmN2JkMGY3MDlmZDVhY2U5MDE5ZTA4MGJiYzRkZjY",
    state: "active",
    traits: {
      consent: {
        newsletter: true,
        tos: "2021-05-21T12:07:56.420Z",
      },
      email: "test@test.com",
      name: "Test User",
    },
    verifiable_addresses: [
      {
        id: "3b0f2966-b5d7-4273-b8a0-b07b96c7591b",
        value: "test@test.com",
        verified: true,
        via: "email",
        status: "completed",
        verified_at: "2021-05-21T12:21:01.653696Z",
        created_at: "2021-05-21T12:08:05.699077Z",
        updated_at: "2022-03-09T11:06:54.143469Z",
      },
    ],
    recovery_addresses: [
      {
        id: "02b54483-8de9-4b7f-ba1d-ebf8a41e74b7",
        value: "test@test.com",
        via: "email",
        created_at: "2021-05-21T12:08:05.706327Z",
        updated_at: "2022-03-09T11:06:54.150838Z",
      },
    ],
    metadata_public: null,
    created_at: "2021-05-21T12:08:05.69095Z",
    updated_at: "2021-05-21T12:08:05.69095Z",
  },
  state: "show_form",
}
