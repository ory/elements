// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"

export const hasGroup = (group: string) => (nodes: UiNode[]) =>
  nodes.some(({ type, group: g }) => type === "input" && g === group)

export const hasOidc = hasGroup("oidc")
export const hasPassword = hasGroup("password")
export const hasDefault = hasGroup("default")
export const hasProfile = hasGroup("profile")
export const hasWebauthn = hasGroup("webauthn")
export const hasPasskey = hasGroup("passkey")
export const hasIdentifierFirst = hasGroup("identifier_first")
export const hasLookupSecret = hasGroup("lookup_secret")
export const hasTotp = hasGroup("totp")
export const hasCode = hasGroup("code")

export const hasHiddenIdentifier = (nodes: UiNode[]) =>
  nodes?.some(
    ({ attributes }) =>
      "name" in attributes &&
      attributes.name === "identifier" &&
      attributes.type === "hidden",
  )
