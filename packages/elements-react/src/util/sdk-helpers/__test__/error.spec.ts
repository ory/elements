// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// error.test.ts
import {
  isGenericErrorResponse,
  isNeedsPrivilegedSessionError,
  isSelfServiceFlowExpiredError,
  isSelfServiceFlowDisabled,
  isBrowserLocationChangeRequired,
  isSelfServiceFlowReplaced,
  isSessionAlreadyAvailable,
  isAddressNotVerified,
  isAalAlreadyFulfilled,
  isSessionAal1Required,
  isSessionAal2Required,
  isNoActiveSession,
  isCsrfError,
  isRedirectUrlNotAllowed,
  isSecurityIdentityMismatch,
  isResponseError,
  isFetchError,
} from "../error"
import { ResponseError, FetchError } from "@ory/client-fetch"

describe("Error identification utilities", () => {
  describe("isGenericErrorResponse", () => {
    it("should return true for valid generic error responses", () => {
      const response = {
        error: {
          id: "error_id",
          message: "Error message",
        },
      }
      expect(isGenericErrorResponse(response)).toBe(true)
    })

    it("should return false for invalid responses", () => {
      expect(isGenericErrorResponse(null)).toBe(false)
      expect(isGenericErrorResponse(undefined)).toBe(false)
      expect(isGenericErrorResponse({})).toBe(false)
      expect(isGenericErrorResponse({ error: "string" })).toBe(false)
      expect(isGenericErrorResponse({ error: {} })).toBe(false)
      expect(isGenericErrorResponse({ error: { message: "Error" } })).toBe(
        false,
      )
    })
  })

  describe("Error type identification", () => {
    const createErrorResponse = (id: string) => ({
      error: {
        id,
        message: "Error message",
      },
    })

    it("should identify needs privileged session error", () => {
      const response = createErrorResponse("session_refresh_required")
      expect(isNeedsPrivilegedSessionError(response)).toBe(true)
      expect(isNeedsPrivilegedSessionError(createErrorResponse("other"))).toBe(
        false,
      )
    })

    it("should identify self service flow expired error", () => {
      const response = createErrorResponse("self_service_flow_expired")
      expect(isSelfServiceFlowExpiredError(response)).toBe(true)
      expect(isSelfServiceFlowExpiredError(createErrorResponse("other"))).toBe(
        false,
      )
    })

    it("should identify self service flow disabled error", () => {
      const response = createErrorResponse("self_service_flow_disabled")
      expect(isSelfServiceFlowDisabled(response)).toBe(true)
      expect(isSelfServiceFlowDisabled(createErrorResponse("other"))).toBe(
        false,
      )
    })

    it("should identify browser location change required error", () => {
      const response = createErrorResponse("browser_location_change_required")
      expect(isBrowserLocationChangeRequired(response)).toBe(true)
      expect(
        isBrowserLocationChangeRequired(createErrorResponse("other")),
      ).toBe(false)
    })

    it("should identify self service flow replaced error", () => {
      const response = createErrorResponse("self_service_flow_replaced")
      expect(isSelfServiceFlowReplaced(response)).toBe(true)
      expect(isSelfServiceFlowReplaced(createErrorResponse("other"))).toBe(
        false,
      )
    })

    it("should identify session already available error", () => {
      const response = createErrorResponse("session_already_available")
      expect(isSessionAlreadyAvailable(response)).toBe(true)
      expect(isSessionAlreadyAvailable(createErrorResponse("other"))).toBe(
        false,
      )
    })

    it("should identify address not verified error", () => {
      const response = createErrorResponse("session_verified_address_required")
      expect(isAddressNotVerified(response)).toBe(true)
      expect(isAddressNotVerified(createErrorResponse("other"))).toBe(false)
    })

    it("should identify AAL already fulfilled error", () => {
      const response = createErrorResponse("session_aal_already_fulfilled")
      expect(isAalAlreadyFulfilled(response)).toBe(true)
      expect(isAalAlreadyFulfilled(createErrorResponse("other"))).toBe(false)
    })

    it("should identify session AAL1 required error", () => {
      const response = createErrorResponse("session_aal1_required")
      expect(isSessionAal1Required(response)).toBe(true)
      expect(isSessionAal1Required(createErrorResponse("other"))).toBe(false)
    })

    it("should identify session AAL2 required error", () => {
      const response = createErrorResponse("session_aal2_required")
      expect(isSessionAal2Required(response)).toBe(true)
      expect(isSessionAal2Required(createErrorResponse("other"))).toBe(false)
    })

    it("should identify no active session error", () => {
      const response = createErrorResponse("session_inactive")
      expect(isNoActiveSession(response)).toBe(true)
      expect(isNoActiveSession(createErrorResponse("other"))).toBe(false)
    })

    it("should identify CSRF error", () => {
      const response = createErrorResponse("security_csrf_violation")
      expect(isCsrfError(response)).toBe(true)
      expect(isCsrfError(createErrorResponse("other"))).toBe(false)
    })

    it("should identify redirect URL not allowed error", () => {
      const response = createErrorResponse(
        "self_service_flow_return_to_forbidden",
      )
      expect(isRedirectUrlNotAllowed(response)).toBe(true)
      expect(isRedirectUrlNotAllowed(createErrorResponse("other"))).toBe(false)
    })

    it("should identify security identity mismatch error", () => {
      const response = createErrorResponse("security_identity_mismatch")
      expect(isSecurityIdentityMismatch(response)).toBe(true)
      expect(isSecurityIdentityMismatch(createErrorResponse("other"))).toBe(
        false,
      )
    })
  })

  describe("Response and Fetch error identification", () => {
    it("should identify ResponseError instances", () => {
      const responseError = new ResponseError(
        {} as unknown as Response,
        "Response error",
      )
      expect(isResponseError(responseError)).toBe(true)

      const responseErrorLike = {
        name: "ResponseError",
        message: "Error",
      }
      expect(isResponseError(responseErrorLike)).toBe(true)

      expect(isResponseError(new Error("Regular error"))).toBe(false)
      expect(isResponseError({})).toBe(false)
    })

    it("should identify FetchError instances", () => {
      const fetchError = new FetchError(new Error(), "Fetch failed")
      expect(isFetchError(fetchError)).toBe(true)
      expect(isFetchError(new Error("Regular error"))).toBe(false)
    })
  })
})
