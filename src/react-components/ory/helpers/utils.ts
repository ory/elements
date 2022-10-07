import { UiNode } from "@ory/client"

export const hasOidc = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "oidc")
export const hasPassword = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "password")
export const hasWebauthn = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "webauthn")
export const hasLookupSecret = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "lookup_secret")
export const hasTotp = (nodes: UiNode[]) =>
  nodes.some(({ group }) => group === "totp")
