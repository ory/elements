// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OAuth2ConsentRequest,
  Session,
  UiContainer,
  UiNode,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import { ConsentFlow } from "../../../util"

const rememberCheckbox: UiNode = {
  type: "input",
  group: "oauth2_consent",
  meta: {
    label: {
      id: 9999111,
      text: "Remember my decision",
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: "input",
    name: "remember",
    value: false,
    type: "checkbox",
    disabled: false,
  },
  messages: [],
}
const acceptButton: UiNode = {
  type: "input",
  group: "oauth2_consent",
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
  group: "oauth2_consent",
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
  session: Session,
): ConsentFlow {
  const ui: UiContainer = {
    action: formAction,
    nodes: [
      ...scopesToUiNodes(consentChallenge.requested_scope ?? []),
      rememberCheckbox,
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
    active: "oauth2_consent",
    ui,
    consent_request: consentChallenge,
    session,
  }
}

function scopesToUiNodes(scopes: string[]): UiNode[] {
  return scopes.map((scope) => ({
    type: "input",
    group: "oauth2_consent",
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
    group: "oauth2_consent",
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
