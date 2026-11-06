// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { act, screen, waitFor } from "@testing-library/react"
import { IntlProvider } from "../../context/intl-context"
import { useOryFlow } from "../../context/flow-context"
import {
  OrySubmitGate,
  OrySubmitGateResult,
  useOrySubmitGate,
} from "../../context/submit-gate"
import { renderWithOryElements } from "../../tests/jest/test-utils"
import { FormValues } from "../../types"
import {
  useOryFormSubmit,
  withoutForeignMethodFields,
} from "./useOryFormSubmit"

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

function rateLimitedResponseError() {
  const response = {
    status: 429,
    headers: {
      get: (name: string) => (name === "retry-after" ? "1" : null),
    },
  }
  return Object.assign(new Error("Too Many Requests"), {
    name: "ResponseError",
    response,
  })
}

// Captures the submit handler so the test can drive a real submission through
// production code, and renders the form's submitting state plus its messages.
let triggerSubmit: ((data?: FormValues) => Promise<void>) | undefined

function SubmitHarness() {
  const { formState, flow } = useOryFlow()
  const onSubmit = useOryFormSubmit()
  triggerSubmit = (
    data = {
      method: "password",
      identifier: "user@example.com",
      password: "secret",
    },
  ) => onSubmit(data as never) as Promise<void>
  return (
    <>
      <span data-testid="submitting">{String(formState.isSubmitting)}</span>
      <ul data-testid="messages">
        {(flow.ui.messages ?? []).map((m) => (
          <li key={m.id}>{m.text}</li>
        ))}
      </ul>
    </>
  )
}

test("should end the submit state after a rate-limited (429) submission so the form stays usable", async () => {
  jest
    .spyOn(await import("../../util/client"), "frontendClient")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockReturnValue({
      updateLoginFlowRaw: jest
        .fn()
        .mockRejectedValue(rateLimitedResponseError()),
    } as any)

  renderWithOryElements(
    <IntlProvider locale="en">
      <SubmitHarness />
    </IntlProvider>,
  )

  expect(screen.getByTestId("submitting").textContent).toBe("false")

  await act(async () => {
    await triggerSubmit?.()
  })

  // Without ending the submit state on rate_limited, action_flow_update would
  // preserve isSubmitting=true and freeze the form.
  await waitFor(() =>
    expect(screen.getByTestId("submitting").textContent).toBe("false"),
  )

  // The default rate-limit message is shown to the user.
  await waitFor(() =>
    expect(
      screen.getByText(/Too many requests\. Please wait a moment/i),
    ).toBeInTheDocument(),
  )
})

function loginThrottledResponseError() {
  const body = {
    error: {
      id: "login_throttled",
      code: 429,
      status: "Too Many Requests",
      message: "too many failed login attempts",
      details: { retry_after: 30 },
    },
  }
  const response = {
    status: 429,
    json: () => Promise.resolve(body),
    clone: () => response,
    headers: {
      get: (name: string) =>
        ({ "content-type": "application/json", "retry-after": "30" })[name] ??
        null,
    },
  }
  return Object.assign(new Error("Too Many Requests"), {
    name: "ResponseError",
    response,
  })
}

test("should show the login throttle message when brute-force protection refuses the login", async () => {
  jest
    .spyOn(await import("../../util/client"), "frontendClient")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockReturnValue({
      updateLoginFlowRaw: jest
        .fn()
        .mockRejectedValue(loginThrottledResponseError()),
    } as any)

  renderWithOryElements(
    <IntlProvider locale="en">
      <SubmitHarness />
    </IntlProvider>,
  )

  await act(async () => {
    await triggerSubmit?.()
  })

  await waitFor(() =>
    expect(
      screen.getByText(
        "Too many failed login attempts. Please try again in 30 seconds.",
      ),
    ).toBeInTheDocument(),
  )
  expect(screen.queryByText(/Too many requests/i)).not.toBeInTheDocument()
  expect(screen.getByTestId("submitting").textContent).toBe("false")
})

function locationChangeRequiredError(redirectBrowserTo: string) {
  const body = {
    error: {
      id: "browser_location_change_required",
      code: 422,
      status: "Unprocessable Entity",
      message: "browser location change required",
    },
    redirect_browser_to: redirectBrowserTo,
  }
  const response = {
    status: 422,
    json: () => Promise.resolve(body),
    clone: () => response,
    text: () => Promise.resolve(JSON.stringify(body)),
    headers: {
      get: (name: string) =>
        name === "content-type" ? "application/json" : null,
    },
  }
  return Object.assign(new Error("Unprocessable Entity"), {
    name: "ResponseError",
    response,
  })
}

function useBrowser(userAgent: string, maxTouchPoints: number) {
  jest.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent)
  Object.defineProperty(navigator, "maxTouchPoints", {
    configurable: true,
    get: () => maxTouchPoints,
  })
}

const iPhoneSafari =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1"
const macChrome =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
const appleAuthorizeUrl =
  "https://appleid.apple.com/auth/authorize?client_id=com.example&response_mode=form_post"
const googleAuthorizeUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?client_id=example"

async function submitSingleSignOnRedirectingTo(
  redirectBrowserTo: string,
  provider: string,
) {
  jest
    .spyOn(await import("../../util/client"), "frontendClient")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockReturnValue({
      updateLoginFlowRaw: jest
        .fn()
        .mockRejectedValue(locationChangeRequiredError(redirectBrowserTo)),
    } as any)
  // jsdom does not implement navigation and reports location.assign as an error.
  jest.spyOn(console, "error").mockImplementation(() => {})

  renderWithOryElements(
    <IntlProvider locale="en">
      <SubmitHarness />
    </IntlProvider>,
  )

  await act(async () => {
    await triggerSubmit?.({ method: "oidc", provider })
  })
}

describe("redirect to a single sign-on provider", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    Reflect.deleteProperty(navigator, "maxTouchPoints")
  })

  test("should keep the form submitting until Apple's sign-in sheet has had time to open", async () => {
    useBrowser(iPhoneSafari, 5)
    await submitSingleSignOnRedirectingTo(appleAuthorizeUrl, "apple")

    act(() => {
      jest.advanceTimersByTime(999)
    })

    expect(screen.getByTestId("submitting").textContent).toBe("true")
  })

  test("should end the submit once Apple's sign-in sheet covers the page", async () => {
    useBrowser(iPhoneSafari, 5)
    await submitSingleSignOnRedirectingTo(appleAuthorizeUrl, "apple")

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId("submitting").textContent).toBe("false")
  })

  test("should keep the form submitting until the page unloads for other providers", async () => {
    useBrowser(iPhoneSafari, 5)
    await submitSingleSignOnRedirectingTo(googleAuthorizeUrl, "google")

    act(() => {
      jest.advanceTimersByTime(60_000)
    })

    expect(screen.getByTestId("submitting").textContent).toBe("true")
  })

  test("should keep the form submitting until the page unloads for Apple in browsers without the sheet", async () => {
    useBrowser(macChrome, 0)
    await submitSingleSignOnRedirectingTo(appleAuthorizeUrl, "apple")

    act(() => {
      jest.advanceTimersByTime(60_000)
    })

    expect(screen.getByTestId("submitting").textContent).toBe("true")
  })
})

test("should keep the traits a single sign-on submission is allowed to carry", () => {
  // FormValues does not model the nested objects react-hook-form produces for
  // dotted node names, so the trait map needs a cast to fit the signature.
  const data = {
    method: "oidc",
    provider: "google",
    csrf_token: "token",
    traits: { email: "user@example.org", age_disclaimer: true },
    transient_payload: { source: "cart" },
    upstream_parameters: { prompt: "select_account" },
  } as unknown as FormValues

  expect(withoutForeignMethodFields(FlowType.Registration, data)).toEqual(data)
})

const foreignFields = ["password", "code", "totp_code", "identifier"]
foreignFields.forEach((field) => {
  test(`should drop "${field}" from a single sign-on submission`, () => {
    const result = withoutForeignMethodFields(FlowType.Login, {
      method: "oidc",
      provider: "google",
      [field]: "value",
    })

    expect(result).not.toHaveProperty(field)
    expect(result).toMatchObject({ method: "oidc", provider: "google" })
  })
})

test("should drop foreign fields for the saml method as well", () => {
  expect(
    withoutForeignMethodFields(FlowType.Login, {
      method: "saml",
      provider: "okta",
      password: "hunter2",
    }),
  ).toEqual({ method: "saml", provider: "okta" })
})

test("should leave submissions of other methods untouched", () => {
  const data = { method: "password", identifier: "user", password: "hunter2" }
  expect(withoutForeignMethodFields(FlowType.Login, data)).toEqual(data)
})

test("should leave provider linking in the settings flow untouched", () => {
  // Linking and unlinking submit the oidc method too, with fields that are not
  // part of a sign-in submission.
  const data = { method: "oidc", link: "google", csrf_token: "token" }
  expect(withoutForeignMethodFields(FlowType.Settings, data)).toEqual(data)
})

describe("submit gates", () => {
  let gate: OrySubmitGate
  let updateLoginFlowRaw: jest.Mock

  function GateHarness() {
    useOrySubmitGate(() => gate())
    return <SubmitHarness />
  }

  async function renderGated() {
    updateLoginFlowRaw = jest.fn().mockRejectedValue(rateLimitedResponseError())
    jest
      .spyOn(await import("../../util/client"), "frontendClient")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({ updateLoginFlowRaw } as any)

    renderWithOryElements(
      <IntlProvider locale="en">
        <GateHarness />
      </IntlProvider>,
    )
  }

  test("should stay submitting and call Ory only after a pending gate passes", async () => {
    let pass: (result: OrySubmitGateResult) => void = () => {}
    gate = () => new Promise((resolve) => (pass = resolve))
    await renderGated()

    let submission: Promise<void> | undefined
    act(() => {
      submission = triggerSubmit?.()
    })

    expect(screen.getByTestId("submitting").textContent).toBe("true")
    expect(updateLoginFlowRaw).not.toHaveBeenCalled()

    await act(async () => {
      pass({
        proceed: true,
        values: { "transient_payload.captcha_turnstile_response": "token" },
      })
      await submission
    })

    expect(updateLoginFlowRaw).toHaveBeenCalledTimes(1)
    expect(updateLoginFlowRaw.mock.calls[0][0]).toMatchObject({
      updateLoginFlowBody: {
        method: "password",
        transient_payload: { captcha_turnstile_response: "token" },
      },
    })
  })

  test("should return to idle without calling Ory when a pending gate cancels", async () => {
    let pass: (result: OrySubmitGateResult) => void = () => {}
    gate = () => new Promise((resolve) => (pass = resolve))
    await renderGated()

    let submission: Promise<void> | undefined
    act(() => {
      submission = triggerSubmit?.()
    })
    expect(screen.getByTestId("submitting").textContent).toBe("true")

    await act(async () => {
      pass({ proceed: false })
      await submission
    })

    expect(screen.getByTestId("submitting").textContent).toBe("false")
    expect(updateLoginFlowRaw).not.toHaveBeenCalled()
    expect(screen.getByTestId("messages")).toBeEmptyDOMElement()
  })

  test("should not start the submit when a gate cancels right away", async () => {
    gate = () => ({ proceed: false })
    await renderGated()

    const submitting: string[] = []
    const observer = new MutationObserver(() =>
      submitting.push(screen.getByTestId("submitting").textContent ?? ""),
    )
    observer.observe(screen.getByTestId("submitting"), {
      characterData: true,
      childList: true,
      subtree: true,
    })

    await act(async () => {
      await triggerSubmit?.()
    })
    observer.disconnect()

    expect(submitting).not.toContain("true")
    expect(updateLoginFlowRaw).not.toHaveBeenCalled()
  })
})
