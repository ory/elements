// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"
import { useIntl } from "react-intl"

function joinWithCommaOr(list: string[], orText = "or"): string {
  if (list.length === 0) {
    return "."
  } else if (list.length === 1) {
    return list[0]
  } else {
    const last = list.pop()
    return `${list.join(", ")} ${orText} ${last}`
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
export function useCardHeaderText(
  nodes: UiNode[],
  opts: opts,
): { title: string; description: string } {
  const intl = useIntl()
  switch (opts.flowType) {
    case FlowType.Recovery:
      return {
        title: intl.formatMessage({
          id: "recovery.title",
        }),
        description: intl.formatMessage({
          id: "recovery.subtitle",
        }),
      }
    case FlowType.Settings:
      return {
        title: intl.formatMessage({
          id: "settings.title",
        }),
        description: intl.formatMessage({
          id: "settings.subtitle",
        }),
      }
    case FlowType.Verification:
      return {
        title: intl.formatMessage({
          id: "verification.title",
        }),
        description: intl.formatMessage({
          id: "verification.subtitle",
        }),
      }
  }

  const parts = []

  if (nodes.find((node) => node.group === "password")) {
    switch (opts.flowType) {
      case FlowType.Registration:
        parts.push(
          intl.formatMessage(
            { id: "card.header.parts.password.registration" },
            // TODO: make this generic for other labels
            { identifierLabel: "email" },
          ),
        )
        break
      default:
        parts.push(
          intl.formatMessage(
            { id: "card.header.parts.password.login" },
            // TODO: make this generic for other labels
            { identifierLabel: "email" },
          ),
        )
    }
  }

  if (nodes.find((node) => node.group === "oidc")) {
    parts.push(
      intl.formatMessage({
        id: "card.header.parts.oidc",
      }),
    )
  }

  if (nodes.find((node) => node.group === "code")) {
    parts.push(intl.formatMessage({ id: "card.header.parts.code" }))
  }

  if (nodes.find((node) => node.group === "passkey")) {
    parts.push(intl.formatMessage({ id: "card.header.parts.passkey" }))
  }

  if (nodes.find((node) => node.group === "webauthn")) {
    parts.push(intl.formatMessage({ id: "card.header.parts.webauthn" }))
  }

  if (nodes.find((node) => node.group === "identifier_first")) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("identifier") &&
        node.attributes.type !== "hidden",
    )

    if (identifier) {
      parts.push(
        intl.formatMessage(
          {
            id: "card.header.parts.identifier-first",
          },
          {
            identifierLabel: identifier.meta.label?.text,
          },
        ),
      )
    }
  }

  // Melden Sie sich mit Ihrer E-Mail und Passwort, einem social provider oder einem Code per E-Mail an

  switch (opts.flowType) {
    case FlowType.Login:
      if (opts.flow.refresh) {
        return {
          title: intl.formatMessage({
            id: "login.title-refresh",
          }),
          description: intl.formatMessage(
            {
              id: "login.subtitle-refresh",
            },
            {
              parts: joinWithCommaOr(parts),
            },
          ),
        }
      }
      return {
        title: intl.formatMessage({
          id: "login.title",
        }),
        description:
          parts.length > 0
            ? intl.formatMessage(
                {
                  id: "login.subtitle",
                },
                {
                  parts: joinWithCommaOr(
                    parts,
                    intl.formatMessage({ id: "misc.or" }),
                  ),
                },
              )
            : "",
      }
    case FlowType.Registration:
      return {
        title: intl.formatMessage({
          id: "registration.title",
        }),
        description:
          parts.length > 0
            ? intl.formatMessage(
                {
                  id: "registration.subtitle",
                },
                {
                  parts: joinWithCommaOr(
                    parts,
                    intl.formatMessage({ id: "misc.or" }),
                  ),
                },
              )
            : "",
      }
  }

  // TODO: This should not happen, as the switch is exhaustive, but typescript doesn't think so
  return {
    title: "Error",
    description: "An error occurred",
  }
}
