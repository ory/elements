// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"

export const nodes = [
  {
    attributes: {
      disabled: false,
      name: "csrf_token",
      required: true,
      type: "hidden",
      value: "MGJxbTV5b291N3JnbTNkdTV4ZHlpazYwOGtvb3hzejQ=",
    },
    group: "default",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "traits.email",
      type: "text",
      value: "john-browser@doe.com",
    },
    group: "profile",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "traits.stringy",
      type: "text",
      value: "foobar",
    },
    group: "profile",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "traits.numby",
      type: "number",
      value: 2.5,
    },
    group: "profile",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "traits.booly",
      type: "checkbox",
      value: false,
    },
    group: "profile",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "traits.should_big_number",
      type: "number",
      value: 2048,
    },
    group: "profile",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "traits.should_long_string",
      type: "text",
      value: "asdfasdfasdfasdfasfdasdfasdfasdf",
    },
    group: "profile",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "method",
      type: "submit",
      value: "profile",
    },
    group: "profile",
    messages: [],
    meta: {
      label: {
        id: 1070003,
        text: "Save",
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "password",
      required: true,
      type: "password",
    },
    group: "password",
    messages: [],
    meta: {
      label: {
        id: 1070001,
        text: "Password",
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "method",
      type: "submit",
      value: "password",
    },
    group: "password",
    messages: [],
    meta: {
      label: {
        id: 1070003,
        text: "Save",
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "csrf_token",
      required: true,
      type: "hidden",
      value: "aWJlY3F1bHp1aXN2YnFvY2NzdHpjNnJ0YnkxNnI2Mzk=",
    },
    group: "default",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "webauthn_remove",
      type: "submit",
      value: "626172626172",
    },
    group: "webauthn",
    messages: [],
    meta: {
      label: {
        context: {
          added_at: "0001-01-01T00:00:00Z",
          display_name: "bar",
        },
        id: 1050012,
        text: 'Remove security key "bar"',
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "webauthn_remove",
      type: "submit",
      value: "666f6f666f6f",
    },
    group: "webauthn",
    messages: [],
    meta: {
      label: {
        context: {
          added_at: "0001-01-01T00:00:00Z",
          display_name: "foo",
        },
        id: 1050012,
        text: 'Remove security key "foo"',
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "webauthn_register_displayname",
      type: "text",
      value: "",
    },
    group: "webauthn",
    messages: [],
    meta: {
      label: {
        id: 1050013,
        text: "Name of the security key",
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "webauthn_register_trigger",
      onclick:
        'window.__oryWebAuthnRegistration({"publicKey":{"challenge":"h7BkjEGXvBnOPDrDsBUiSRB90QamqOtWbprYhcaBwro=","rp":{"name":"Ory Corp","id":"localhost"},"user":{"name":"placeholder","icon":"https://via.placeholder.com/128","displayName":"placeholder","id":"uJTun1EFRNurSuKVCLV9ZA=="},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-35},{"type":"public-key","alg":-36},{"type":"public-key","alg":-257},{"type":"public-key","alg":-258},{"type":"public-key","alg":-259},{"type":"public-key","alg":-37},{"type":"public-key","alg":-38},{"type":"public-key","alg":-39},{"type":"public-key","alg":-8}],"authenticatorSelection":{"requireResidentKey":false,"userVerification":"preferred"},"timeout":60000}})',
      onload:
        "if (\n  (window \u0026\u0026 window.__oryWebAuthnLogin \u0026\u0026 window.__oryWebAuthnRegistration) ||\n  (!window \u0026\u0026 __oryWebAuthnLogin \u0026\u0026 __oryWebAuthnRegistration)\n) {\n  // Already registered these functions, do nothing.\n} else {\n  function __oryWebAuthnBufferDecode(value) {\n    return Uint8Array.from(atob(value), function (c) {\n      return c.charCodeAt(0)\n    });\n  }\n\n  function __oryWebAuthnBufferEncode(value) {\n    return btoa(String.fromCharCode.apply(null, new Uint8Array(value)))\n      .replace(/\\+/g, '-')\n      .replace(/\\//g, '_')\n      .replace(/=/g, '');\n  }\n\n  function __oryWebAuthnLogin(opt, resultQuerySelector = '*[name=\"webauthn_login\"]', triggerQuerySelector = '*[name=\"webauthn_login_trigger\"]') {\n    if (!window.PublicKeyCredential) {\n      alert('This browser does not support WebAuthn!');\n    }\n\n    opt.publicKey.challenge = __oryWebAuthnBufferDecode(opt.publicKey.challenge);\n    opt.publicKey.allowCredentials = opt.publicKey.allowCredentials.map(function (value) {\n      return {\n        ...value,\n        id: __oryWebAuthnBufferDecode(value.id)\n      }\n    });\n\n    navigator.credentials.get(opt).then(function (credential) {\n      document.querySelector(resultQuerySelector).value = JSON.stringify({\n        id: credential.id,\n        rawId: __oryWebAuthnBufferEncode(credential.rawId),\n        type: credential.type,\n        response: {\n          authenticatorData: __oryWebAuthnBufferEncode(credential.response.authenticatorData),\n          clientDataJSON: __oryWebAuthnBufferEncode(credential.response.clientDataJSON),\n          signature: __oryWebAuthnBufferEncode(credential.response.signature),\n          userHandle: __oryWebAuthnBufferEncode(credential.response.userHandle),\n        },\n      })\n\n      document.querySelector(triggerQuerySelector).closest('form').submit()\n    }).catch((err) =\u003e {\n      alert(err)\n    })\n  }\n\n  function __oryWebAuthnRegistration(opt, resultQuerySelector = '*[name=\"webauthn_register\"]', triggerQuerySelector = '*[name=\"webauthn_register_trigger\"]') {\n    if (!window.PublicKeyCredential) {\n      alert('This browser does not support WebAuthn!');\n    }\n\n    opt.publicKey.user.id = __oryWebAuthnBufferDecode(opt.publicKey.user.id);\n    opt.publicKey.challenge = __oryWebAuthnBufferDecode(opt.publicKey.challenge);\n\n    if (opt.publicKey.excludeCredentials) {\n      opt.publicKey.excludeCredentials = opt.publicKey.excludeCredentials.map(function (value) {\n        return {\n          ...value,\n          id: __oryWebAuthnBufferDecode(value.id)\n        }\n      })\n    }\n\n    navigator.credentials.create(opt).then(function (credential) {\n      document.querySelector(resultQuerySelector).value = JSON.stringify({\n        id: credential.id,\n        rawId: __oryWebAuthnBufferEncode(credential.rawId),\n        type: credential.type,\n        response: {\n          attestationObject: __oryWebAuthnBufferEncode(credential.response.attestationObject),\n          clientDataJSON: __oryWebAuthnBufferEncode(credential.response.clientDataJSON),\n        },\n      })\n\n      document.querySelector(triggerQuerySelector).closest('form').submit()\n    }).catch((err) =\u003e {\n      alert(err)\n    })\n  }\n\n  if (window) {\n    window.__oryWebAuthnLogin = __oryWebAuthnLogin\n    window.__oryWebAuthnRegistration = __oryWebAuthnRegistration\n  }\n}\n",
      type: "button",
      value: "",
    },
    group: "webauthn",
    messages: [],
    meta: {
      label: {
        id: 1050012,
        text: "Add security key",
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "webauthn_register",
      type: "hidden",
      value: "",
    },
    group: "webauthn",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "csrf_token",
      required: true,
      type: "hidden",
      value: "aXZ1M3E2cmdkOG5namVsMzNob2kwcmlnMGo0Yjc5MGw=",
    },
    group: "default",
    messages: [],
    meta: {},
    type: "input",
  },
  {
    attributes: {
      height: 256,
      id: "totp_qr",
      src: "data:image/png;base64,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",
      width: 256,
    },
    group: "totp",
    messages: [],
    meta: {
      label: {
        id: 1050005,
        text: "Authenticator app QR code",
        type: "info",
      },
    },
    type: "img",
  },
  {
    attributes: {
      id: "totp_secret_key",
      text: {
        context: {
          secret: "Z5YLZXOY6TQPJEUHYX6O4JVAXFVZPQSD",
        },
        id: 1050006,
        text: "Z5YLZXOY6TQPJEUHYX6O4JVAXFVZPQSD",
        type: "info",
      },
    },
    group: "totp",
    messages: [],
    meta: {
      label: {
        id: 1050006,
        text: "This is your authenticator app secret. Use it if you can not scan the QR code.",
        type: "info",
      },
    },
    type: "text",
  },
  {
    attributes: {
      disabled: false,
      name: "totp_code",
      required: true,
      type: "text",
    },
    group: "totp",
    messages: [],
    meta: {
      label: {
        id: 1070006,
        text: "Verify code",
        type: "info",
      },
    },
    type: "input",
  },
  {
    attributes: {
      disabled: false,
      name: "method",
      type: "submit",
      value: "totp",
    },
    group: "totp",
    messages: [],
    meta: {
      label: {
        id: 1070003,
        text: "Save",
        type: "info",
      },
    },
    type: "input",
  },
] as unknown as UiNode[]
