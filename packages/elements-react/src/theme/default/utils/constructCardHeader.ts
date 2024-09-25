// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"

function joinWithCommaOr(list: string[]): string {
  if (list.length === 0) {
    return "."
  } else if (list.length === 1) {
    return list[0] + "."
  } else {
    const last = list.pop()
    return `${list.join(", ")} or ${last}.`
  }
}

type opts =
  | {
      flowType: FlowType.Login
      flow: {
        refresh?: boolean
      }
    }
  | {
      flowType:
        | FlowType.Error
        | FlowType.Registration
        | FlowType.Verification
        | FlowType.Recovery
        | FlowType.Settings
    }

/**
 * Constructs a title and a description for the card header.
 *
 * The title is a title suitable for the current flow, e.g. "Sign in" or "Update your account".
 *
 * The description for a login & registration flow, is a collection of the labels of the input fields.
 * For example, if the user has a password and an email address, the description will be "Sign in with your email and password".
 * And for registration, the listed options depend on the project configuration.
 *
 * For verification, recovery and settings flows, the description is a generic one, e.g. "Enter the email address associated with your account to verify it".
 *
 *
 * @param nodes - the UI nodes of the current flow
 * @param opts - can be a flow object, only needed for the refresh login flow
 * @returns a title and a description for the card header
 */
export function constructCardHeaderText(
  nodes: UiNode[],
  opts: opts,
): { title: string; description: string } {
  switch (opts.flowType) {
    case FlowType.Recovery:
      return {
        title: "Recover your account",
        description:
          "Enter the email address associated with your account to receive a one-time access code",
      }
    case FlowType.Settings:
      return {
        title: "Update your account",
        description: "Update your account settings",
      }
    case FlowType.Verification:
      return {
        title: "Verify your account",
        description:
          "Enter the email address associated with your account to verify it",
      }
  }

  const parts = []

  if (nodes.find((node) => node.group === "password")) {
    switch (opts.flowType) {
      case FlowType.Registration:
        parts.push(`your email and a password`)
        break
      default:
        parts.push(`your email and password`)
    }
  }
  if (nodes.find((node) => node.group === "oidc")) {
    parts.push(`a social provider`)
  }

  if (nodes.find((node) => node.group === "code")) {
    parts.push(`a code sent to your email`)
  }

  if (nodes.find((node) => node.group === "passkey")) {
    parts.push(`a Passkey`)
  }

  if (nodes.find((node) => node.group === "webauthn")) {
    parts.push(`a security key`)
  }

  if (nodes.find((node) => node.group === "identifier_first")) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("identifier") &&
        node.attributes.type !== "hidden",
    )

    if (identifier) {
      parts.push(`your ${identifier.meta.label?.text}`)
    }
  }

  switch (opts.flowType) {
    case FlowType.Login:
      if (opts.flow.refresh) {
        return {
          title: "Reauthenticate",
          description: "Confirm your identity with " + joinWithCommaOr(parts),
        }
      }
      return {
        title: "Sign in",
        description:
          parts.length > 0 ? "Sign in with " + joinWithCommaOr(parts) : "",
      }
    case FlowType.Registration:
      return {
        title: "Sign up",
        description:
          parts.length > 0 ? "Sign up with " + joinWithCommaOr(parts) : "",
      }
  }

  // TODO: This should not happen, as the switch is exhaustive, but typescript doesn't think so
  return {
    title: "Error",
    description: "An error occurred",
  }
}
