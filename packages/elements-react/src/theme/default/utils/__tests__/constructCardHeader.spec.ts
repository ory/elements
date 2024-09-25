import { FlowType, UiNode, UiTextTypeEnum } from "@ory/client-fetch"
import { constructCardHeaderText } from "../constructCardHeader"

const password: UiNode = {
  group: "password",
  type: "text",
  attributes: {
    node_type: "input",
    name: "password",
    type: "password",
    value: "",
    disabled: false,
  },
  messages: [],
  meta: {},
}

const oidc: UiNode = {
  group: "oidc",
  type: "text",
  attributes: {
    node_type: "input",
    name: "oidc",
    type: "hidden",
    value: "",
    disabled: false,
  },
  messages: [],
  meta: {},
}

const code: UiNode = {
  group: "code",
  type: "text",
  attributes: {
    node_type: "input",
    name: "code",
    type: "text",
    value: "",
    disabled: false,
  },
  messages: [],
  meta: {},
}

const passkey: UiNode = {
  group: "passkey",
  type: "text",
  attributes: {
    node_type: "input",
    name: "passkey",
    type: "text",
    value: "",
    disabled: false,
  },
  messages: [],
  meta: {},
}

const webauthn: UiNode = {
  group: "webauthn",
  type: "text",
  attributes: {
    node_type: "input",
    name: "webauthn",
    type: "text",
    value: "",
    disabled: false,
  },
  messages: [],
  meta: {},
}

const defaultGroup: UiNode = {
  group: "default",
  type: "input",
  attributes: {
    node_type: "input",
    name: "traits.email",
    type: "text",
    value: "",
    disabled: false,
    label: {
      text: "Email",
      type: UiTextTypeEnum.Info,
      id: 9999,
    },
  },
  messages: [],
  meta: {
    label: {
      text: "Email",
      type: UiTextTypeEnum.Info,
      id: 9999,
    },
  },
}

const identifierFirst: UiNode = {
  group: "identifier_first",
  type: "input",
  attributes: {
    node_type: "input",
    name: "identifier_first",
    type: "text",
    value: "",
    disabled: false,
    label: {
      text: "Email",
      type: UiTextTypeEnum.Info,
      id: 9999,
    },
  },
  messages: [],
  meta: {},
}

const identifierFirstPhone: UiNode = {
  group: "identifier_first",
  type: "input",
  attributes: {
    node_type: "input",
    name: "identifier_first",
    type: "text",
    value: "",
    disabled: false,
    label: {
      text: "Phone number",
      type: UiTextTypeEnum.Info,
      id: 9999,
    },
  },
  messages: [],
  meta: {},
}

const combinations = {
  oidc,
  code,
  passkey,
  webauthn,
  defaultGroup,
  identifierFirst,
  password,
  identifierFirstPhone,
  default_and_password: [defaultGroup, password],
  default_and_code: [defaultGroup, code],
  default_and_oidc: [defaultGroup, oidc],
  default_and_passkeys: [defaultGroup, passkey],
  default_and_webauthn: [defaultGroup, webauthn],
  idenfier_first_and_oidc: [identifierFirst, oidc],
}

for (const flowType of [
  FlowType.Login,
  FlowType.Registration,
  FlowType.Verification,
  FlowType.Recovery,
  FlowType.Settings,
]) {
  describe("flowType=" + flowType, () => {
    for (const refresh of [true, false]) {
      // Yes, it doesn't make sense to test other flows with refresh enabled, but it doesn't hurt, and typescript is dumb here.
      describe("refresh=" + refresh, () => {
        const opts = {
          flowType,
          flow: { refresh },
        }
        for (const [key, value] of Object.entries(combinations)) {
          describe("combination=" + key, () => {
            test("constructCardHeaderText", () => {
              const res = constructCardHeaderText(
                Array.isArray(value) ? value : [value],
                opts,
              )
              expect(res).toMatchSnapshot()
            })
          })
        }
      })
    }
  })
}
