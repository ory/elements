// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryClientConfiguration } from "@ory/elements-react"

export const config = {
  name: "Acme Inc.",
  sdk: {
    url: "https://example.com",
  },
  project: {
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    login_ui_url: "",
    recovery_ui_url: "",
    registration_ui_url: "",
    verification_ui_url: "",
    default_redirect_url: "https://ory.sh",
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
