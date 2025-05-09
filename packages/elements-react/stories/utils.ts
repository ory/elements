// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryClientConfiguration } from "@ory/elements-react"
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
} satisfies OryClientConfiguration

// TODO(jonas): we neeed to harmonize the error types across the SDKs
// At the moment, the error types are not consistent across the SDKs.
// This is a temporary solution to make the SDKs work with the new error types.

/** Error parsing polyfils */

/* eslint-disable */
/**
 * The standard Ory JSON API error format.
 * @export
 * @interface ErrorGeneric
 */
export interface ErrorGeneric {
  /**
   *
   * @type {GenericError}
   * @memberof ErrorGeneric
   */
  error: GenericError
}

export function ErrorGenericFromJSON(json: any): ErrorGeneric {
  return ErrorGenericFromJSONTyped(json, false)
}

export function ErrorGenericFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ErrorGeneric {
  if (json == null) {
    return json
  }
  return {
    error: GenericErrorFromJSON(json["error"]),
  }
}

export function GenericErrorFromJSON(json: any): GenericError {
  return GenericErrorFromJSONTyped(json, false)
}

export function GenericErrorFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GenericError {
  if (json == null) {
    return json
  }
  return {
    code: json["code"] == null ? undefined : json["code"],
    debug: json["debug"] == null ? undefined : json["debug"],
    details: json["details"] == null ? undefined : json["details"],
    id: json["id"] == null ? undefined : json["id"],
    message: json["message"],
    reason: json["reason"] == null ? undefined : json["reason"],
    request: json["request"] == null ? undefined : json["request"],
    status: json["status"] == null ? undefined : json["status"],
  }
}

export interface GenericError {
  /**
   * The status code
   * @type {number}
   * @memberof GenericError
   */
  code?: number
  /**
   * Debug information
   *
   * This field is often not exposed to protect against leaking
   * sensitive information.
   * @type {string}
   * @memberof GenericError
   */
  debug?: string
  /**
   * Further error details
   * @type {object}
   * @memberof GenericError
   */
  details?: object
  /**
   * The error ID
   *
   * Useful when trying to identify various errors in application logic.
   * @type {string}
   * @memberof GenericError
   */
  id?: string
  /**
   * Error message
   *
   * The error's message.
   * @type {string}
   * @memberof GenericError
   */
  message: string
  /**
   * A human-readable reason for the error
   * @type {string}
   * @memberof GenericError
   */
  reason?: string
  /**
   * The request ID
   *
   * The request ID is often exposed internally in order to trace
   * errors across service architectures. This is often a UUID.
   * @type {string}
   * @memberof GenericError
   */
  request?: string
  /**
   * The status description
   * @type {string}
   * @memberof GenericError
   */
  status?: string
}

/** Lists only the given groups for a given flow.
 *
 * @param flow
 * @param groups
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

/** Lists the available social login providers for a given flow.
 *
 * @param flow
 * @param group
 * @param providers
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
 *
 * @param flow
 * @param method
 */
export const patchMethodActive = (
  flow: LoginFlow,
  method: LoginFlowActiveEnum,
) => ({
  ...flow,
  active: method,
})
