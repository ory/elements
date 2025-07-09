// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  UiNode,
  UiNodeGroupEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import {
  CardHeaderTextOptions,
  useCardHeaderText,
} from "../constructCardHeader"
import { renderHook } from "@testing-library/react"
import { PropsWithChildren } from "react"
import { IntlProvider } from "../../../../context/intl-context"
import { OryLocales } from "../../../../locales"

console.error = jest.fn()

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

const aal2Nodes: Record<string, UiNode> = {
  webauthn: {
    group: "webauthn",
    type: "input",
    attributes: {
      node_type: "input",
      name: "webauthn_login",
      type: "hidden",
      value: "",
      disabled: false,
    },
    messages: [],
    meta: {},
  },
  totp: {
    group: "totp",
    type: "input",
    attributes: {
      node_type: "input",
      name: "totp_code",
      type: "text",
      value: "",
      disabled: false,
    },
    messages: [],
    meta: {},
  },
  lookup_secret: {
    group: "lookup_secret",
    type: "input",
    attributes: {
      node_type: "input",
      name: "lookup_secret",
      type: "text",
      value: "",
      disabled: false,
    },
    messages: [],
    meta: {},
  },
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

const identifierFirstPhone: UiNode = {
  group: "identifier_first",
  type: "input",
  attributes: {
    node_type: "input",
    name: "identifier_first",
    type: "text",
    value: "",
    disabled: false,
  },
  messages: [],
  meta: {
    label: {
      text: "Phone number",
      type: UiTextTypeEnum.Info,
      id: 9999,
    },
  },
}

const profileSubmit: UiNode = {
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
      id: 1040001,
      text: "Sign up",
      type: "info",
    },
  },
}

const combinations = {
  oidc,
  code,
  passkey,
  webauthn: aal2Nodes.webauthn,
  defaultGroup,
  identifierFirst,
  password,
  identifierFirstPhone,
  default_and_password: [defaultGroup, password],
  default_and_code: [defaultGroup, code],
  default_and_oidc: [defaultGroup, oidc],
  default_and_passkeys: [defaultGroup, passkey],
  default_and_webauthn: [defaultGroup, aal2Nodes.webauthn],
  idenfier_first_and_oidc: [identifierFirst, oidc],
  profile_first_registration: [defaultGroup, profileSubmit],
}

const wrapper =
  (lang: string) =>
  ({ children }: PropsWithChildren) => (
    <IntlProvider locale={lang}>{children}</IntlProvider>
  )

describe("constructCardHeaderText", () => {
  for (const lang of Object.keys(OryLocales)) {
    describe("language=" + lang, () => {
      for (const flowType of [
        FlowType.Login,
        FlowType.Registration,
        FlowType.Verification,
        FlowType.Recovery,
        FlowType.Settings,
      ] as const) {
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
                    const res = renderHook(
                      () =>
                        useCardHeaderText(
                          {
                            nodes: Array.isArray(value) ? value : [value],
                            action: "",
                            method: "",
                          },
                          opts as CardHeaderTextOptions,
                        ),
                      { wrapper: wrapper(lang) },
                    )
                    expect(res.result.current).toMatchSnapshot()
                  })
                })
              }
            })
          }
        })
      }

      test("constructCardHeaderText on account linking", () => {
        const res = renderHook(
          () =>
            useCardHeaderText(
              {
                nodes: [defaultGroup],
                action: "",
                method: "",
                messages: [
                  {
                    id: 1010016,
                    text: "",
                    type: "error",
                    context: {
                      duplicateIdentifier: "duplicateIdentifier",
                      provider: "provider",
                    },
                  },
                ],
              },
              { flowType: FlowType.Login, flow: { refresh: false } },
            ),
          { wrapper: wrapper(lang) },
        )
        expect(res.result.current).toMatchSnapshot()
      })

      test("constructCardHeaderText on 2fa login - multi", () => {
        const res = renderHook(
          () =>
            useCardHeaderText(
              {
                nodes: Object.values(aal2Nodes),
                action: "",
                method: "POST",
                messages: [
                  { id: 1010004, text: "", type: "info", context: {} },
                ],
              },
              {
                flowType: FlowType.Login,
                flow: { refresh: false, requested_aal: "aal2" },
                formState: { current: "select_method" },
              },
            ),
          { wrapper: wrapper(lang) },
        )
        expect(res.result.current).toMatchSnapshot()
      })

      for (const method of ["webauthn", "totp", "lookup_secret"]) {
        test(`constructCardHeaderText on 2fa login - ${method}`, () => {
          const res = renderHook(
            () =>
              useCardHeaderText(
                {
                  nodes: [aal2Nodes[method]],
                  action: "",
                  method: "POST",
                  messages: [
                    { id: 1010004, text: "", type: "info", context: {} },
                  ],
                },
                {
                  flowType: FlowType.Login,
                  flow: { refresh: false, requested_aal: "aal2" },
                  formState: {
                    current: "method_active",
                    method: method as UiNodeGroupEnum,
                  },
                },
              ),
            { wrapper: wrapper(lang) },
          )
          expect(res.result.current).toMatchSnapshot()
        })
      }

      test("constructCardHeaderText on consent screen", () => {
        const res = renderHook(
          () =>
            useCardHeaderText(
              {
                nodes: [],
                action: "",
                method: "",
                messages: [],
              },
              {
                flowType: FlowType.OAuth2Consent,
                flow: {
                  consent_request: {
                    challenge: "consent-challenge",
                    client: { client_name: "Client Test" },
                  },
                  session: { id: "session-id" },
                },
              },
            ),
          { wrapper: wrapper(lang) },
        )
        expect(res.result.current).toMatchSnapshot()
      })
    })
  }
})
