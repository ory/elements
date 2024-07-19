import {
  ErrorBrowserLocationChangeRequired,
  ErrorFlowReplaced,
  GenericError,
  NeedsPrivilegedSessionError,
  ResponseError,
  SelfServiceFlowExpiredError,
} from "@ory/client-fetch"

/**
 * Checks if the response is a NeedsPrivilegedSessionError. This error is returned when the self-service flow requires
 * the user to re-authenticate in order to perform an action that requires elevated privileges.
 *
 * @param response
 */
export function isNeedsPrivilegedSessionError(
  response: any,
): response is NeedsPrivilegedSessionError {
  return response.error.id === "session_refresh_required"
}

/**
 * Checks if the response is a SelfServiceFlowExpiredError. This error is returned when the self-service flow is expired.
 *
 * @param response
 */
export function isSelfServiceFlowExpiredError(
  response: any,
): response is SelfServiceFlowExpiredError {
  return response.error.id === "self_service_flow_expired"
}

/**
 * Checks if the response is a GenericError due to the self-service flow being disabled (for example disabled registration).
 *
 * @param response
 */
export function isSelfServiceFlowDisabled(
  response: any,
): response is GenericError {
  return response.error.id === "self_service_flow_disabled"
}

/**
 * Checks if the response is a ErrorBrowserLocationChangeRequired.
 * @param response
 */
export function isBrowserLocationChangeRequired(
  response: any,
): response is ErrorBrowserLocationChangeRequired {
  return response.error.id === "browser_location_change_required"
}

/**
 * Checks if the response is a ErrorFlowReplaced.
 * @param response
 */
export function isSelfServiceFlowReplaced(
  response: any,
): response is ErrorFlowReplaced {
  return response.error.id === "self_service_flow_replaced"
}

/**
 * Checks if the response is a GenericError due to the session already being available.
 * @param response
 */
export function isSessionAlreadyAvailable(
  response: any,
): response is GenericError {
  return response.error.id === "session_already_available"
}

/**
 * Checks if the response is a GenericError due to the session being inactive.
 *
 * @param response
 */
export function isAddressNotVerified(response: any): response is GenericError {
  return response.error.id === "session_verified_address_required"
}

/**
 * Checks if the response is a GenericError due to the session already having fulfilled the AAL requirement.
 *
 * @param response
 */
export function isAalAlreadyFulfilled(response: any): response is GenericError {
  return response.error.id === "session_aal_already_fulfilled"
}

/**
 * Checks if the response is a GenericError due to the session requiring a higher AAL.
 *
 * @param response
 */
export function isSessionAal1Required(response: any): response is GenericError {
  return response.error.id === "session_aal1_required"
}

/**
 * Checks if the response is a GenericError due to the session requiring a higher AAL.
 *
 * @param response
 */
export function isSessionAal2Required(response: any): response is GenericError {
  return response.error.id === "session_aal2_required"
}

/**
 * Checks if the response is a GenericError due to the session being inactive.
 *
 * @param response
 */
export function isNoActiveSession(response: any): response is GenericError {
  return response.error.id === "session_inactive"
}
/**
 * Checks if the response is a GenericError due to a CSRF violation.
 *
 * @param response
 */
export function isCsrfError(response: any): response is GenericError {
  return response.error.id === "security_csrf_violation"
}

/**
 * Checks if the response is a GenericError due to the redirect URL being forbidden.
 *
 * @param response
 */
export function isRedirectUrlNotAllowed(
  response: any,
): response is GenericError {
  return response.error.id === "self_service_flow_return_to_forbidden"
}

/**
 * Checks if the response is a GenericError due to two sessions being active.
 *
 * @param response
 */
export function isSecurityIdentityMismatch(
  response: any,
): response is GenericError {
  return response.error.id === "security_identity_mismatch"
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
