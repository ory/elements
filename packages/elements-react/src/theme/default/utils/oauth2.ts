import {
  OAuth2ConsentRequest,
  UiContainer,
  UiNode,
  UiNodeGroupEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import { ConsentFlow } from "../../../util"

const acceptButton: UiNode = {
  type: "input",
  group: "consent" as UiNodeGroupEnum,
  meta: {
    label: {
      id: 9999111,
      text: "Accept",
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: "input",
    name: "action",
    value: "accept",
    type: "submit",
    disabled: false,
  },
  messages: [],
}
const rejectButton: UiNode = {
  type: "input",
  group: "consent" as UiNodeGroupEnum,
  meta: {
    label: {
      id: 9999111,
      text: "Reject",
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: "input",
    name: "action",
    value: "reject",
    type: "submit",
    disabled: false,
  },
  messages: [],
}

export function translateConsentChallengeToUiNodes(
  consentChallenge: OAuth2ConsentRequest,
  csrfToken: string,
  formAction: string,
): ConsentFlow {
  const ui: UiContainer = {
    action: formAction,
    // TODO: CSRF
    nodes: [
      ...scopesToUiNodes(consentChallenge.requested_scope ?? []),
      rejectButton,
      acceptButton,
      csrfTokenNode(csrfToken),
      challengeNode(consentChallenge.challenge),
    ],
    method: "POST",
    messages: [],
  }

  return {
    id: "UNSET",
    created_at: new Date(),
    expires_at: new Date(),
    issued_at: new Date(),
    state: "show_form",
    ui,
  }
}

function scopesToUiNodes(scopes: string[]): UiNode[] {
  return scopes.map((scope, i) => ({
    type: "input",
    group: "consent" as UiNodeGroupEnum,
    meta: {
      label: {
        id: 9999111,
        text: scope,
        type: UiTextTypeEnum.Info,
      },
    },
    attributes: {
      node_type: "input",
      name: `grant_scope`,
      value: scope,
      type: "checkbox",
      disabled: false,
    },
    messages: [],
  }))
}

function csrfTokenNode(csrfToken: string): UiNode {
  return {
    type: "input",
    group: "default",
    meta: {},
    attributes: {
      node_type: "input",
      name: "csrf_token",
      value: csrfToken,
      type: "hidden",
      disabled: false,
    },
    messages: [],
  }
}

function challengeNode(challenge: string): UiNode {
  return {
    type: "input",
    group: "default",
    meta: {},
    attributes: {
      node_type: "input",
      name: "consent_challenge",
      value: challenge,
      type: "hidden",
      disabled: false,
    },
    messages: [],
  }
}
