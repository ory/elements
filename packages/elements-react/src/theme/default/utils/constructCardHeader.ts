// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AuthenticatorAssuranceLevel,
  FlowType,
  isUiNodeInputAttributes,
  OAuth2ConsentRequest,
  Session,
  UiContainer,
} from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { FormState } from "../../../context"
import { uiTextToFormattedMessage } from "../../../util"
import { findNode } from "../../../util/ui"

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

export type CardHeaderTextOptions =
  | {
      flowType: FlowType.Login
      flow: {
        refresh?: boolean
        requested_aal?: AuthenticatorAssuranceLevel
      }
      formState?: FormState
    }
  | {
      flowType: FlowType.Registration
      formState?: FormState
    }
  | {
      flowType: FlowType.OAuth2Consent
      flow: {
        consent_request: OAuth2ConsentRequest
        session: Session
      }
    }
  | {
      flowType:
        | FlowType.Error
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
  container: UiContainer,
  opts: CardHeaderTextOptions,
): { title: string; description: string; messageId?: string } {
  const nodes = container.nodes
  const intl = useIntl()
  switch (opts.flowType) {
    case FlowType.Recovery: {
      const recoveryV2Message = container.messages?.find((m) =>
        [1060006, 1060005, 1060004].includes(m.id),
      )

      if (recoveryV2Message) {
        return {
          title: intl.formatMessage({
            id: "recovery.title",
          }),
          description: uiTextToFormattedMessage(recoveryV2Message, intl),
          messageId: recoveryV2Message.id + "",
        }
      } else if (
        nodes.find(
          (node) =>
            "name" in node.attributes && node.attributes.name === "code",
        )
      ) {
        return {
          title: intl.formatMessage({
            id: "recovery.title",
          }),
          description: intl.formatMessage({
            id: "identities.messages.1060003",
          }),
          messageId: "1060003",
        }
      }
      return {
        title: intl.formatMessage({
          id: "recovery.title",
        }),
        description: intl.formatMessage({
          id: "recovery.subtitle",
        }),
      }
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
      if (
        nodes.find(
          (node) =>
            "name" in node.attributes && node.attributes.name === "code",
        )
      ) {
        return {
          title: intl.formatMessage({
            id: "verification.title",
          }),
          description: intl.formatMessage({
            id: "identities.messages.1080003",
          }),
          messageId: "1080003",
        }
      }
      return {
        title: intl.formatMessage({
          id: "verification.title",
        }),
        description: intl.formatMessage({
          id: "verification.subtitle",
        }),
      }
    case FlowType.Login: {
      // account linking
      const accountLinkingMessage = container.messages?.find(
        (m) => m.id === 1010016,
      )
      if (accountLinkingMessage) {
        return {
          title: intl.formatMessage({
            id: "account-linking.title",
          }),
          description: intl.formatMessage(
            {
              id: "identities.messages.1010016",
            },
            accountLinkingMessage.context as Record<string, string>,
          ),
          messageId: "1010016",
        }
      }
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

  if (nodes.find((node) => node.group === "oidc" || node.group === "saml")) {
    parts.push(
      intl.formatMessage({
        id: "card.header.parts.oidc",
      }),
    )
  }

  if (nodes.find((node) => node.group === "code")) {
    parts.push(intl.formatMessage({ id: "card.header.parts.code" }))
  }

  if (nodes.find((node) => node.group === "totp")) {
    parts.push(intl.formatMessage({ id: "card.header.parts.totp" }))
  }

  if (nodes.find((node) => node.group === "lookup_secret")) {
    parts.push(intl.formatMessage({ id: "card.header.parts.lookup_secret" }))
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

  if (nodes.some((node) => node.group === "profile")) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("traits.") &&
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

  switch (opts.flowType) {
    case FlowType.Login: {
      const codeMethodNode = findNode(container.nodes, {
        node_type: "input",
        group: "code",
        name: "code",
        type: "text",
      })
      const codeSent =
        codeMethodNode &&
        opts.formState?.current === "method_active" &&
        opts.formState?.method === "code"
      if (opts.flow.refresh) {
        return {
          title: intl.formatMessage({
            id: "login.title-refresh",
          }),
          description: intl.formatMessage(
            {
              id: codeSent
                ? "identities.messages.1010014"
                : "login.subtitle-refresh",
            },
            {
              parts: joinWithCommaOr(parts),
            },
          ),
        }
      } else if (opts.flow.requested_aal === "aal2") {
        return {
          title: intl.formatMessage({
            id: "login.title-aal2",
          }),
          description: intl.formatMessage({
            id: codeSent
              ? "identities.messages.1010014"
              : opts.formState?.current === "method_active"
                ? `login.${opts.formState.method}.subtitle`
                : "login.subtitle-aal2",
          }),
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
                  id: codeSent
                    ? "identities.messages.1010014"
                    : "login.subtitle",
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
    case FlowType.Registration: {
      const codeMethodNode = findNode(container.nodes, {
        node_type: "input",
        group: "code",
        name: "code",
        type: "text",
      })
      const codeSent =
        codeMethodNode &&
        opts.formState?.current === "method_active" &&
        opts.formState?.method === "code"
      return {
        title: intl.formatMessage({
          id: "registration.title",
        }),
        description: codeSent
          ? intl.formatMessage({ id: "identities.messages.1040005" })
          : parts.length > 0
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
    case FlowType.OAuth2Consent:
      return {
        title: intl.formatMessage(
          {
            id: "consent.title",
          },
          {
            party: opts.flow.consent_request.client?.client_name,
          },
        ),
        description: intl.formatMessage(
          {
            id: "consent.subtitle",
          },
          {
            identifier: (opts.flow.session.identity?.traits.email ??
              "") as string,
          },
        ),
      }
  }

  // TODO: This should not happen, as the switch is exhaustive, but typescript doesn't think so
  return {
    title: "Error",
    description: "An error occurred",
  }
}
