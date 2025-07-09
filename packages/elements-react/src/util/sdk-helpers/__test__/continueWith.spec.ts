// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// continueWith.test.ts
import { handleContinueWith } from "../continueWith"
import {
  ContinueWith,
  ContinueWithRecoveryUiActionEnum,
  ContinueWithSetOrySessionTokenActionEnum,
  ContinueWithSettingsUiActionEnum,
  ContinueWithVerificationUiActionEnum,
  ContinueWithRedirectBrowserToActionEnum,
} from "@ory/client-fetch"

describe("handleContinueWith", () => {
  let onRedirectMock: jest.Mock

  beforeEach(() => {
    onRedirectMock = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return false when continueWith is undefined", () => {
    const result = handleContinueWith(undefined, { onRedirect: onRedirectMock })
    expect(result).toBe(false)
    expect(onRedirectMock).not.toHaveBeenCalled()
  })

  it("should return false when continueWith is empty array", () => {
    const result = handleContinueWith([], { onRedirect: onRedirectMock })
    expect(result).toBe(false)
    expect(onRedirectMock).not.toHaveBeenCalled()
  })

  it("should handle redirect_browser_to action correctly", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithRedirectBrowserToActionEnum.RedirectBrowserTo,
        redirect_browser_to: "https://example.com",
      },
    ]

    const result = handleContinueWith(continueWith, {
      onRedirect: onRedirectMock,
    })
    expect(result).toBe(true)
    expect(onRedirectMock).toHaveBeenCalledWith("https://example.com", true)
  })

  it("should handle show_verification_ui action with URL correctly", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithVerificationUiActionEnum.ShowVerificationUi,
        flow: {
          id: "test-flow-id",
          url: "https://example.com/verification",
          verifiable_address: "example@example.org",
        },
      },
    ]

    const result = handleContinueWith(continueWith, {
      onRedirect: onRedirectMock,
    })
    expect(result).toBe(true)
    expect(onRedirectMock).toHaveBeenCalledWith(
      "https://example.com/verification",
      true,
    )
  })

  it("should handle show_verification_ui action without URL correctly", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithVerificationUiActionEnum.ShowVerificationUi,
        flow: {
          id: "test-flow-id",
          verifiable_address: "example@example.org",
        },
      },
    ]

    const result = handleContinueWith(continueWith, {
      onRedirect: onRedirectMock,
    })
    expect(result).toBe(true)
    expect(onRedirectMock).toHaveBeenCalledWith(
      "/verification?flow=test-flow-id",
      false,
    )
  })

  it("should handle show_recovery_ui action correctly", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithRecoveryUiActionEnum.ShowRecoveryUi,
        flow: {
          id: "test-flow-id",
        },
      },
    ]

    const result = handleContinueWith(continueWith, {
      onRedirect: onRedirectMock,
    })
    expect(result).toBe(true)
    expect(onRedirectMock).toHaveBeenCalledWith(
      "/recovery?flow=test-flow-id",
      false,
    )
  })

  it("should handle show_settings_ui action correctly", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithSettingsUiActionEnum.ShowSettingsUi,
        flow: {
          id: "test-flow-id",
        },
      },
    ]

    const result = handleContinueWith(continueWith, {
      onRedirect: onRedirectMock,
    })
    expect(result).toBe(true)
    expect(onRedirectMock).toHaveBeenCalledWith(
      "/settings?flow=test-flow-id",
      false,
    )
  })

  it("should throw an error for set_ory_session_token action", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithSetOrySessionTokenActionEnum.SetOrySessionToken,
        ory_session_token: "token123", // Note: property name changed from session_token
      },
    ]

    expect(() => {
      handleContinueWith(continueWith, { onRedirect: onRedirectMock })
    }).toThrow("Ory Elements does not support API flows yet.")
    expect(onRedirectMock).not.toHaveBeenCalled()
  })

  it("should throw an error for unknown action", () => {
    const continueWith = [
      {
        action: "unknown_action",
      },
    ] as unknown as ContinueWith[]

    expect(() => {
      handleContinueWith(continueWith, { onRedirect: onRedirectMock })
    }).toThrow(/Unknown action:/)
    expect(onRedirectMock).not.toHaveBeenCalled()
  })

  it("should pick the highest priority action", () => {
    const continueWith: ContinueWith[] = [
      {
        action: ContinueWithRedirectBrowserToActionEnum.RedirectBrowserTo,
        redirect_browser_to: "https://example.com/redirect",
      },
      {
        action: ContinueWithSettingsUiActionEnum.ShowSettingsUi,
        flow: {
          id: "settings-id",
        },
      },
    ]

    const result = handleContinueWith(continueWith, {
      onRedirect: onRedirectMock,
    })
    expect(result).toBe(true)
    // Should use show_settings_ui because it has higher priority than redirect_browser_to
    expect(onRedirectMock).toHaveBeenCalledWith(
      "/settings?flow=settings-id",
      false,
    )
  })
})
