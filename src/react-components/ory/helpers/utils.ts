// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"

export const hasOidc = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "oidc")

export const hasPassword = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "password")

export const hasWebauthn = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "webauthn")

export const haslookup_secret = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "lookup_secret")

export const hasTotp = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "totp")

export const hasCode = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "code")

export const hasHiddenIdentifier = (nodes: UiNode[]) =>
  nodes.some(
    ({ attributes }) =>
      "name" in attributes &&
      attributes.name === "identifier" &&
      attributes.type === "hidden",
  )
