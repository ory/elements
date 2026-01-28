// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OAuth2ConsentRequest } from "@ory/client-fetch"

import {
  getConsentFlow,
  acceptConsentRequest,
  rejectConsentRequest,
} from "./consent"
import { serverSideOAuth2Client } from "./client"

jest.mock("./client", () => ({
  serverSideOAuth2Client: jest.fn(),
}))

describe("getConsentFlow", () => {
  const mockGetOAuth2ConsentRequest = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(serverSideOAuth2Client as jest.Mock).mockReturnValue({
      getOAuth2ConsentRequest: mockGetOAuth2ConsentRequest,
    })
  })

  it("should return null when consent_challenge is missing", async () => {
    const result = await getConsentFlow({})
    expect(result).toBeNull()
    expect(mockGetOAuth2ConsentRequest).not.toHaveBeenCalled()
  })

  it("should return null when consent_challenge is not a string", async () => {
    const result = await getConsentFlow({ consent_challenge: 123 as unknown })
    expect(result).toBeNull()
    expect(mockGetOAuth2ConsentRequest).not.toHaveBeenCalled()
  })

  it("should return null when consent_challenge is an array", async () => {
    const result = await getConsentFlow({ consent_challenge: ["challenge1"] })
    expect(result).toBeNull()
    expect(mockGetOAuth2ConsentRequest).not.toHaveBeenCalled()
  })

  it("should return consent request on valid challenge", async () => {
    const mockConsentRequest: OAuth2ConsentRequest = {
      challenge: "test-challenge",
      requested_scope: ["openid", "profile"],
    }
    mockGetOAuth2ConsentRequest.mockResolvedValue(mockConsentRequest)

    const result = await getConsentFlow({ consent_challenge: "test-challenge" })

    expect(result).toEqual(mockConsentRequest)
    expect(mockGetOAuth2ConsentRequest).toHaveBeenCalledWith({
      consentChallenge: "test-challenge",
    })
  })

  it("should handle Promise params", async () => {
    const mockConsentRequest: OAuth2ConsentRequest = {
      challenge: "test-challenge",
    }
    mockGetOAuth2ConsentRequest.mockResolvedValue(mockConsentRequest)

    const result = await getConsentFlow(
      Promise.resolve({ consent_challenge: "test-challenge" }),
    )

    expect(result).toEqual(mockConsentRequest)
  })

  it("should return null on API error (silent failure)", async () => {
    mockGetOAuth2ConsentRequest.mockRejectedValue(new Error("API Error"))

    const result = await getConsentFlow({ consent_challenge: "test-challenge" })

    expect(result).toBeNull()
  })
})

describe("acceptConsentRequest", () => {
  const mockAcceptOAuth2ConsentRequest = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(serverSideOAuth2Client as jest.Mock).mockReturnValue({
      acceptOAuth2ConsentRequest: mockAcceptOAuth2ConsentRequest,
    })
  })

  it("should accept consent with required params", async () => {
    mockAcceptOAuth2ConsentRequest.mockResolvedValue({
      redirect_to: "https://example.com/callback",
    })

    const result = await acceptConsentRequest("test-challenge", {
      grantScope: ["openid", "profile"],
    })

    expect(result).toBe("https://example.com/callback")
    expect(mockAcceptOAuth2ConsentRequest).toHaveBeenCalledWith({
      consentChallenge: "test-challenge",
      acceptOAuth2ConsentRequest: {
        grant_scope: ["openid", "profile"],
        remember: undefined,
        remember_for: undefined,
        session: undefined,
      },
    })
  })

  it("should accept consent with remember option", async () => {
    mockAcceptOAuth2ConsentRequest.mockResolvedValue({
      redirect_to: "https://example.com/callback",
    })

    await acceptConsentRequest("test-challenge", {
      grantScope: ["openid"],
      remember: true,
      rememberFor: 3600,
    })

    expect(mockAcceptOAuth2ConsentRequest).toHaveBeenCalledWith({
      consentChallenge: "test-challenge",
      acceptOAuth2ConsentRequest: {
        grant_scope: ["openid"],
        remember: true,
        remember_for: 3600,
        session: undefined,
      },
    })
  })

  it("should accept consent with session tokens", async () => {
    mockAcceptOAuth2ConsentRequest.mockResolvedValue({
      redirect_to: "https://example.com/callback",
    })

    await acceptConsentRequest("test-challenge", {
      grantScope: ["openid"],
      session: {
        accessToken: { custom_claim: "value" },
        idToken: { name: "Test User" },
      },
    })

    expect(mockAcceptOAuth2ConsentRequest).toHaveBeenCalledWith({
      consentChallenge: "test-challenge",
      acceptOAuth2ConsentRequest: {
        grant_scope: ["openid"],
        remember: undefined,
        remember_for: undefined,
        session: {
          access_token: { custom_claim: "value" },
          id_token: { name: "Test User" },
        },
      },
    })
  })
})

describe("rejectConsentRequest", () => {
  const mockRejectOAuth2ConsentRequest = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(serverSideOAuth2Client as jest.Mock).mockReturnValue({
      rejectOAuth2ConsentRequest: mockRejectOAuth2ConsentRequest,
    })
  })

  it("should reject consent with default error", async () => {
    mockRejectOAuth2ConsentRequest.mockResolvedValue({
      redirect_to: "https://example.com/error",
    })

    const result = await rejectConsentRequest("test-challenge")

    expect(result).toBe("https://example.com/error")
    expect(mockRejectOAuth2ConsentRequest).toHaveBeenCalledWith({
      consentChallenge: "test-challenge",
      rejectOAuth2Request: {
        error: "access_denied",
        error_description: "The resource owner denied the request",
      },
    })
  })

  it("should reject consent with custom error", async () => {
    mockRejectOAuth2ConsentRequest.mockResolvedValue({
      redirect_to: "https://example.com/error",
    })

    await rejectConsentRequest("test-challenge", {
      error: "invalid_scope",
      errorDescription: "The requested scope is invalid",
    })

    expect(mockRejectOAuth2ConsentRequest).toHaveBeenCalledWith({
      consentChallenge: "test-challenge",
      rejectOAuth2Request: {
        error: "invalid_scope",
        error_description: "The requested scope is invalid",
      },
    })
  })
})
