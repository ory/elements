// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describeSnapshot, flowFromSnapshot } from "./naming"

test("should read the flow out of the snapshot's ui.action", () => {
  expect(
    flowFromSnapshot({
      ui: {
        action:
          "https://slug.projects.oryapis:8080/self-service/verification?flow=0",
      },
    }),
  ).toBe("verification")
  expect(
    flowFromSnapshot({ ui: { action: "https://example.org/whoami" } }),
  ).toBeNull()
  expect(flowFromSnapshot({})).toBeNull()
})

test("should render a flow Kratos refused to create as the error screen", () => {
  expect(
    flowFromSnapshot({
      error: {
        code: 400,
        message: "The request was malformed or contained invalid parameters",
        reason: "Recovery is not allowed because it was disabled.",
      },
    }),
  ).toBe("error")
})

test("should name the error screen after what it shows", () => {
  expect(
    describeSnapshot("recovery/disabled/initial-form.json", "error"),
  ).toMatchObject({
    title: "Ory Elements/Recovery/Disabled",
    exportName: "ShowError",
    name: "Show Error",
    id: "ory-elements-recovery-disabled--show-error",
    layout: "centered",
  })
})

test("should title a snapshot from its directory", () => {
  expect(
    describeSnapshot("login/1fa/unified/password/initial-form.json", "login"),
  ).toMatchObject({
    title: "Ory Elements/Login/First Factor/Unified/Password",
    name: "Show Form",
    id: "ory-elements-login-first-factor-unified-password--show-form",
    layout: "centered",
  })
})

test("should render settings flows full screen", () => {
  expect(
    describeSnapshot("settings/totp/initial-form.json", "settings"),
  ).toMatchObject({
    title: "Ory Elements/Settings/TOTP",
    layout: "fullscreen",
  })
})

test("should move variant directories from the title into the story name", () => {
  expect(
    describeSnapshot(
      "login/1fa/unified/captcha/hidden/show-send.json",
      "login",
    ),
  ).toMatchObject({
    title: "Ory Elements/Login/First Factor/Unified/Captcha",
    exportName: "ShowSendHidden",
    name: "Show Send Hidden",
  })
})

test("should keep the organization flows apart under their shared title", () => {
  const oidc = describeSnapshot(
    "login/1fa/identifier_first/organization-oidc/initial-form.json",
    "login",
  )
  const saml = describeSnapshot(
    "login/1fa/identifier_first/organization-saml/initial-form.json",
    "login",
  )

  expect(oidc.title).toBe(saml.title)
  expect(oidc.exportName).toBe("ShowFormOIDC")
  expect(saml.exportName).toBe("ShowFormSAML")
  expect(oidc.id).not.toBe(saml.id)
})
