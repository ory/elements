// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ErrorBrowserLocationChangeRequired,
  ErrorFlowReplaced,
  GenericError,
  NeedsPrivilegedSessionError,
  ResponseError,
  SelfServiceFlowExpiredError,
  FetchError,
  ErrorGeneric,
  ContinueWith,
} from "@ory/client-fetch"
import type { GenericErrorContent } from "@ory/client-fetch/src/models/GenericErrorContent"

export function isGenericErrorResponse(
  response: unknown,
): response is { error: GenericError } {
  return (
    typeof response === "object" &&
    !!response &&
    "error" in response &&
    typeof response.error === "object" &&
    !!response.error &&
    "id" in response.error
  )
}

/**
 * Checks if the response is a NeedsPrivilegedSessionError.
 */
export function isNeedsPrivilegedSessionError(
  response: unknown,
): response is NeedsPrivilegedSessionError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_refresh_required"
  )
}

/**
 * Checks if the response is a SelfServiceFlowExpiredError.
 */
export function isSelfServiceFlowExpiredError(
  response: unknown,
): response is SelfServiceFlowExpiredError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "self_service_flow_expired"
  )
}

/**
 * Checks if the response is a GenericError due to self-service flow being disabled.
 */
export function isSelfServiceFlowDisabled(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "self_service_flow_disabled"
  )
}

/**
 * Checks if the response is a ErrorBrowserLocationChangeRequired.
 */
export function isBrowserLocationChangeRequired(
  response: unknown,
): response is ErrorBrowserLocationChangeRequired {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "browser_location_change_required"
  )
}

/**
 * Checks if the response is a ErrorFlowReplaced.
 */
export function isSelfServiceFlowReplaced(
  response: unknown,
): response is ErrorFlowReplaced {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "self_service_flow_replaced"
  )
}

/**
 * Checks if the response is a GenericError due to session being already available.
 */
export function isSessionAlreadyAvailable(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_already_available"
  )
}

/**
 * Checks if the response is a GenericError due to address not being verified.
 */
export function isAddressNotVerified(response: unknown): response is {
  error: GenericErrorContent & {
    details?: {
      continue_with?: [ContinueWith]
    }
  }
} {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_verified_address_required"
  )
}

/**
 * Checks if the response is a GenericError due to AAL being already fulfilled.
 */
export function isAalAlreadyFulfilled(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_aal_already_fulfilled"
  )
}

/**
 * Checks if the response is a GenericError due to session requiring AAL1.
 */
export function isSessionAal1Required(
  response: unknown,
): response is ErrorGeneric {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_aal1_required"
  )
}

/**
 * Checks if the response is a GenericError due to session requiring AAL2.
 */
export function isSessionAal2Required(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_aal2_required"
  )
}

/**
 * Checks if the response is a GenericError due to no active session.
 */
export function isNoActiveSession(response: unknown): response is GenericError {
  return (
    isGenericErrorResponse(response) && response.error.id === "session_inactive"
  )
}

/**
 * Checks if the response is a GenericError due to CSRF violation.
 */
export function isCsrfError(response: unknown): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "security_csrf_violation"
  )
}

/**
 * Checks if the response is a GenericError due to redirect URL not being allowed.
 */
export function isRedirectUrlNotAllowed(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "self_service_flow_return_to_forbidden"
  )
}

/**
 * Checks if the response is a GenericError due to security identity mismatch.
 */
export function isSecurityIdentityMismatch(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "security_identity_mismatch"
  )
}

export const isResponseError = (err: unknown): err is ResponseError => {
  if (err instanceof ResponseError) {
    return true
  }

  return (
    typeof err === "object" &&
    !!err &&
    "name" in err &&
    err.name === "ResponseError"
  )
}

export const isFetchError = (err: unknown): err is FetchError => {
  return err instanceof FetchError
}
