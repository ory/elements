// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ErrorBrowserLocationChangeRequired,
  ErrorFlowReplaced,
  GenericError,
  NeedsPrivilegedSessionError,
  ResponseError,
  SelfServiceFlowExpiredError,
} from "../"

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
 * Checks if the response is a NeedsPrivilegedSessionError. This error is returned when the self-service flow requires
 * the user to re-authenticate in order to perform an action that requires elevated privileges.
 *
 * @param response - The response to check.
 */
export function isNeedsPrivilegedSessionError(
  response: unknown,
): response is NeedsPrivilegedSessionError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_refresh_required"
  )
}

/**1
 * Checks if the response is a SelfServiceFlowExpiredError. This error is returned when the self-service flow is expired.
 *
 * @param response - The response to check.
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
 * Checks if the response is a GenericError due to the self-service flow being disabled (for example disabled registration).
 *
 * @param response - The response to check.
 */
export function isSelfServiceFlowDisabled(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    isGenericErrorResponse(response) &&
    response.error.id === "self_service_flow_disabled"
  )
}

/**
 * Checks if the response is a ErrorBrowserLocationChangeRequired.
 * @param response - The response to check.
 */
export function isBrowserLocationChangeRequired(
  response: unknown,
): response is ErrorBrowserLocationChangeRequired {
  return (
    isGenericErrorResponse(response) &&
    isGenericErrorResponse(response) &&
    response.error.id === "browser_location_change_required"
  )
}

/**
 * Checks if the response is a ErrorFlowReplaced.
 * @param response - The response to check.
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
 * Checks if the response is a GenericError due to the session already being available.
 * @param response - The response to check.
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
 * Checks if the response is a GenericError due to the session being inactive.
 *
 * @param response - The response to check.
 */
export function isAddressNotVerified(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_verified_address_required"
  )
}

/**
 * Checks if the response is a GenericError due to the session already having fulfilled the AAL requirement.
 *
 * @param response - The response to check.
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
 * Checks if the response is a GenericError due to the session requiring a higher AAL.
 *
 * @param response - The response to check.
 */
export function isSessionAal1Required(
  response: unknown,
): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "session_aal1_required"
  )
}

/**
 * Checks if the response is a GenericError due to the session requiring a higher AAL.
 *
 * @param response - The response to check.
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
 * Checks if the response is a GenericError due to the session being inactive.
 *
 * @param response - The response to check.
 */
export function isNoActiveSession(response: unknown): response is GenericError {
  return (
    isGenericErrorResponse(response) && response.error.id === "session_inactive"
  )
}
/**
 * Checks if the response is a GenericError due to a CSRF violation.
 *
 * @param response - The response to check.
 */
export function isCsrfError(response: unknown): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === "security_csrf_violation"
  )
}

/**
 * Checks if the response is a GenericError due to the redirect URL being forbidden.
 *
 * @param response - The response to check.
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
 * Checks if the response is a GenericError due to two sessions being active.
 *
 * @param response - The response to check.
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
