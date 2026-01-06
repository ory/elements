// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AuthenticatorAssuranceLevel,
  FlowType,
  isUiNodeInputAttributes,
  UiContainer,
} from "@ory/client-fetch"
import type { FormState } from "../../../composables/useOryFlow"
import { findNode } from "../../../util/ui"

/**
 * Translation function type for i18n.
 */
export type TranslateFunction = (
  key: string,
  values?: Record<string, string>,
) => string

function joinWithCommaOr(list: string[], orText = "or"): string {
  if (list.length === 0) {
    return ""
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
      flowType:
        | FlowType.Error
        | FlowType.Verification
        | FlowType.Recovery
        | FlowType.Settings
    }

/**
 * Constructs a title and a description for the card header.
 *
 * @param container - The UI container from the flow
 * @param opts - Options including flow type and state
 * @param t - Translation function from useOryIntl
 */
export function useCardHeaderText(
  container: UiContainer,
  opts: CardHeaderTextOptions,
  t: TranslateFunction,
): { title: string; description: string; messageId?: string } {
  const nodes = container.nodes

  switch (opts.flowType) {
    case FlowType.Recovery: {
      const recoveryV2Message = container.messages?.find((m) =>
        [1060006, 1060005, 1060004].includes(m.id),
      )

      if (recoveryV2Message) {
        return {
          title: t("recovery.title"),
          description: recoveryV2Message.text,
          messageId: recoveryV2Message.id + "",
        }
      } else if (
        nodes.find(
          (node) =>
            "name" in node.attributes && node.attributes.name === "code",
        )
      ) {
        return {
          title: t("recovery.title"),
          description: t("identities.messages.1060003"),
          messageId: "1060003",
        }
      }
      return {
        title: t("recovery.title"),
        description: t("recovery.subtitle"),
      }
    }
    case FlowType.Settings:
      return {
        title: t("settings.title"),
        description: t("settings.subtitle"),
      }
    case FlowType.Verification:
      if (
        nodes.find(
          (node) =>
            "name" in node.attributes && node.attributes.name === "code",
        )
      ) {
        return {
          title: t("verification.title"),
          description: t("identities.messages.1080003"),
          messageId: "1080003",
        }
      }
      return {
        title: t("verification.title"),
        description: t("verification.subtitle"),
      }
    case FlowType.Login: {
      // account linking
      const accountLinkingMessage = container.messages?.find(
        (m) => m.id === 1010016,
      )
      if (accountLinkingMessage) {
        return {
          title: t("account-linking.title"),
          description: t("identities.messages.1010016"),
          messageId: "1010016",
        }
      }
    }
  }

  const parts: string[] = []

  if (nodes.find((node) => node.group === "password")) {
    switch (opts.flowType) {
      case FlowType.Registration:
        parts.push(
          t("card.header.parts.password.registration", {
            identifierLabel: "email",
          }),
        )
        break
      default:
        parts.push(
          t("card.header.parts.password.login", { identifierLabel: "email" }),
        )
    }
  }

  if (nodes.find((node) => node.group === "oidc" || node.group === "saml")) {
    parts.push(t("card.header.parts.oidc"))
  }

  if (nodes.find((node) => node.group === "code")) {
    parts.push(t("card.header.parts.code"))
  }

  if (nodes.find((node) => node.group === "totp")) {
    parts.push(t("card.header.parts.totp"))
  }

  if (nodes.find((node) => node.group === "lookup_secret")) {
    parts.push(t("card.header.parts.lookup_secret"))
  }

  if (nodes.find((node) => node.group === "passkey")) {
    parts.push(t("card.header.parts.passkey"))
  }

  if (nodes.find((node) => node.group === "webauthn")) {
    parts.push(t("card.header.parts.webauthn"))
  }

  if (nodes.find((node) => node.group === "identifier_first")) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("identifier") &&
        node.attributes.type !== "hidden",
    )

    if (identifier) {
      const label = identifier.meta.label?.text || "identifier"
      parts.push(
        t("card.header.parts.identifier-first", { identifierLabel: label }),
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
      const label = identifier.meta.label?.text || "information"
      parts.push(
        t("card.header.parts.identifier-first", { identifierLabel: label }),
      )
    }
  }

  const orText = t("misc.or")

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
          title: t("login.title-refresh"),
          description: codeSent
            ? t("identities.messages.1010014")
            : t("login.subtitle-refresh", {
                parts: joinWithCommaOr([...parts], orText),
              }),
        }
      } else if (opts.flow.requested_aal === "aal2") {
        return {
          title: t("login.title-aal2"),
          description: codeSent
            ? t("identities.messages.1010014")
            : t("login.subtitle-aal2"),
        }
      }
      return {
        title: t("login.title"),
        description:
          parts.length > 0
            ? codeSent
              ? t("identities.messages.1010014")
              : t("login.subtitle", {
                  parts: joinWithCommaOr([...parts], orText),
                })
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
        title: t("registration.title"),
        description: codeSent
          ? t("identities.messages.1040005")
          : parts.length > 0
            ? t("registration.subtitle", {
                parts: joinWithCommaOr([...parts], orText),
              })
            : "",
      }
    }
  }

  return {
    title: t("error.title"),
    description: t("error.description"),
  }
}
