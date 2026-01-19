// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { OryClientConfiguration } from "@ory/elements-vue"
import {
  LoginFlow,
  LoginFlowFromJSON,
  RegistrationFlow,
  SettingsFlow,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { LoginFlowActiveEnum } from "@ory/client-fetch/src/models/LoginFlow"

export const config: OryClientConfiguration = {
  sdk: {
    url: "http://localhost:0000",
  },
  project: {
    name: "Acme Inc.",
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    login_ui_url: "",
    recovery_ui_url: "",
    registration_ui_url: "",
    verification_ui_url: "",
    default_redirect_url: "https://ory.sh",
    error_ui_url: "",
    settings_ui_url: "",
    default_locale: "en",
    locale_behavior: "respect_accept_language",
  },
}

export interface ErrorGeneric {
  error: GenericError
}

export function ErrorGenericFromJSON(json: unknown): ErrorGeneric {
  return ErrorGenericFromJSONTyped(json, false)
}

export function ErrorGenericFromJSONTyped(
  json: unknown,
  _ignoreDiscriminator: boolean,
): ErrorGeneric {
  if (json == null) {
    return json as unknown as ErrorGeneric
  }
  const jsonObj = json as Record<string, unknown>
  return {
    error: GenericErrorFromJSON(jsonObj["error"]),
  }
}

export function GenericErrorFromJSON(json: unknown): GenericError {
  return GenericErrorFromJSONTyped(json, false)
}

export function GenericErrorFromJSONTyped(
  json: unknown,
  _ignoreDiscriminator: boolean,
): GenericError {
  if (json == null) {
    return json as unknown as GenericError
  }
  const jsonObj = json as Record<string, unknown>
  return {
    code: jsonObj["code"] == null ? undefined : (jsonObj["code"] as number),
    debug: jsonObj["debug"] == null ? undefined : (jsonObj["debug"] as string),
    details:
      jsonObj["details"] == null ? undefined : (jsonObj["details"] as object),
    id: jsonObj["id"] == null ? undefined : (jsonObj["id"] as string),
    message: jsonObj["message"] as string,
    reason:
      jsonObj["reason"] == null ? undefined : (jsonObj["reason"] as string),
    request:
      jsonObj["request"] == null ? undefined : (jsonObj["request"] as string),
    status:
      jsonObj["status"] == null ? undefined : (jsonObj["status"] as string),
  }
}

export interface GenericError {
  code?: number
  debug?: string
  details?: object
  id?: string
  message: string
  reason?: string
  request?: string
  status?: string
}

/**
 * Lists only the given groups for a given flow.
 */
export const listOnlyGroups = (
  flow: LoginFlow | RegistrationFlow | SettingsFlow,
  groups: UiNodeGroupEnum[],
): LoginFlow => {
  return LoginFlowFromJSON({
    ...flow,
    ui: {
      ...flow.ui,
      nodes: flow.ui.nodes.filter((node) => {
        return groups.includes(node.group)
      }),
    },
  })
}

/**
 * Lists the available social login providers for a given flow.
 */
export const listOnlySsoProviders = (
  flow: LoginFlow,
  group: "saml" | "oidc",
  providers: string[],
): LoginFlow => {
  return LoginFlowFromJSON({
    ...flow,
    ui: {
      ...flow.ui,
      nodes: flow.ui.nodes.filter((node) => {
        if (
          node.group !== group ||
          node.attributes.node_type !== "input" ||
          node.attributes.name !== "provider"
        ) {
          return true
        }

        return providers.includes(
          (node.attributes.value as string).toLowerCase(),
        )
      }),
    },
  })
}

/**
 * Patches the active method of a login flow.
 */
export const patchMethodActive = (
  flow: LoginFlow,
  method: LoginFlowActiveEnum,
) => ({
  ...flow,
  active: method,
})
