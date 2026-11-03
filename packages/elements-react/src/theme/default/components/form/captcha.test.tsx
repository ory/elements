// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlowFromJSON, UiNode } from "@ory/client-fetch"
import { act, screen } from "@testing-library/react"
import { forwardRef, useImperativeHandle } from "react"
import captchaFlow from "../../../../../.stub-responses/login/1fa/identifier_first/captcha/hidden/initial-form.json"
import { useOryFormSubmit } from "../../../../components/form/useOryFormSubmit"
import { useOryFlow } from "../../../../context/flow-context"
import { useIsOryNativeSubmitBlocked } from "../../../../context/submit-gate"
import { IntlProvider } from "../../../../context/intl-context"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { DefaultCaptcha } from "./captcha"

type TurnstileCallbacks = {
  onSuccess: (token: string) => void
  onBeforeInteractive: () => void
  onError: (error: string) => void
  onExpire: () => void
}

let turnstile: TurnstileCallbacks
const reset = jest.fn()

jest.mock("@marsidev/react-turnstile", () => ({
  Turnstile: forwardRef(function MockTurnstile(
    props: TurnstileCallbacks & { className?: string },
    ref,
  ) {
    turnstile = props
    useImperativeHandle(ref, () => ({ reset }))
    return <div data-testid="turnstile" className={props.className} />
  }),
}))

const flow = LoginFlowFromJSON(captchaFlow)
const optionsNode = flow.ui.nodes.find(
  (node: UiNode) =>
    "name" in node.attributes &&
    node.attributes.name === "captcha_turnstile_options",
)!

let updateLoginFlowRaw: jest.Mock
let submit: () => Promise<void>

function Harness() {
  const { formState } = useOryFlow()
  const onSubmit = useOryFormSubmit()
  const isNativeSubmitBlocked = useIsOryNativeSubmitBlocked()
  submit = () =>
    onSubmit({
      method: "identifier_first",
      identifier: "a@b.c",
    }) as Promise<void>
  return (
    <>
      <DefaultCaptcha node={optionsNode} />
      <span data-testid="submitting">{String(formState.isSubmitting)}</span>
      <span data-testid="ready">{String(formState.isReady)}</span>
      <span data-testid="native-blocked">{String(isNativeSubmitBlocked)}</span>
    </>
  )
}

async function renderCaptcha() {
  updateLoginFlowRaw = jest.fn().mockRejectedValue(
    Object.assign(new Error("Too Many Requests"), {
      name: "ResponseError",
      response: { status: 429, headers: { get: () => "1" } },
    }),
  )
  jest
    .spyOn(await import("../../../../util/client"), "frontendClient")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockReturnValue({ updateLoginFlowRaw } as any)

  renderWithOryElements(
    <IntlProvider locale="en">
      <Harness />
    </IntlProvider>,
    { flow: { flowType: FlowType.Login, flow } },
  )
}

function startSubmit() {
  let submission: Promise<void> = Promise.resolve()
  act(() => {
    submission = submit()
  })
  return submission
}

function sentToken() {
  const body = updateLoginFlowRaw.mock.calls[0][0].updateLoginFlowBody as {
    transient_payload?: { captcha_turnstile_response?: string }
  }
  return body.transient_payload?.captcha_turnstile_response
}

const errorText = /Security verification failed/

beforeEach(() => {
  jest.useRealTimers()
  console.error = jest.fn()
  reset.mockClear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

test("should never mark the form as not ready", async () => {
  await renderCaptcha()
  expect(screen.getByTestId("ready")).toHaveTextContent("true")

  act(() => turnstile.onBeforeInteractive())
  expect(screen.getByTestId("ready")).toHaveTextContent("true")
})

test("should send the token once Turnstile succeeded", async () => {
  await renderCaptcha()
  act(() => turnstile.onSuccess("token-1"))

  await act(() => submit())

  expect(updateLoginFlowRaw).toHaveBeenCalledTimes(1)
  expect(sentToken()).toBe("token-1")
})

test("should wait for the token when the submit comes first", async () => {
  await renderCaptcha()

  const submission = startSubmit()
  expect(screen.getByTestId("submitting")).toHaveTextContent("true")
  expect(updateLoginFlowRaw).not.toHaveBeenCalled()

  await act(async () => {
    turnstile.onSuccess("token-1")
    await submission
  })

  expect(updateLoginFlowRaw).toHaveBeenCalledTimes(1)
  expect(sentToken()).toBe("token-1")
})

test("should cancel the submit without an error when the challenge becomes interactive", async () => {
  await renderCaptcha()

  const submission = startSubmit()
  await act(async () => {
    turnstile.onBeforeInteractive()
    await submission
  })

  expect(updateLoginFlowRaw).not.toHaveBeenCalled()
  expect(screen.getByTestId("submitting")).toHaveTextContent("false")
  expect(screen.queryByText(errorText)).not.toBeInTheDocument()
  expect(screen.getByTestId("turnstile")).not.toHaveClass("!hidden")
})

test("should not start a submit while the challenge is showing", async () => {
  await renderCaptcha()
  act(() => turnstile.onBeforeInteractive())

  await act(() => submit())

  expect(updateLoginFlowRaw).not.toHaveBeenCalled()
  expect(screen.getByTestId("submitting")).toHaveTextContent("false")
})

test("should end the wait with an error after 30 seconds", async () => {
  jest.useFakeTimers()
  await renderCaptcha()

  const submission = startSubmit()
  await act(async () => {
    jest.advanceTimersByTime(30_000)
    await submission
  })

  expect(updateLoginFlowRaw).not.toHaveBeenCalled()
  expect(screen.getByTestId("submitting")).toHaveTextContent("false")
  expect(screen.getByText(errorText)).toBeInTheDocument()
})

test("should show the error and still submit after a Turnstile client error", async () => {
  await renderCaptcha()
  act(() => turnstile.onError("110200"))
  expect(screen.getByText(errorText)).toBeInTheDocument()

  await act(() => submit())

  expect(updateLoginFlowRaw).toHaveBeenCalledTimes(1)
  expect(sentToken()).toBeUndefined()
})

test("should fetch a new token after a submit and wait for it on the next one", async () => {
  await renderCaptcha()
  act(() => turnstile.onSuccess("token-1"))
  await act(() => submit())

  expect(reset).toHaveBeenCalledTimes(1)
  expect(screen.getByTestId("ready")).toHaveTextContent("true")

  const submission = startSubmit()
  expect(updateLoginFlowRaw).toHaveBeenCalledTimes(1)

  await act(async () => {
    turnstile.onSuccess("token-2")
    await submission
  })

  expect(updateLoginFlowRaw).toHaveBeenCalledTimes(2)
  expect(
    updateLoginFlowRaw.mock.calls[1][0].updateLoginFlowBody.transient_payload,
  ).toEqual({ captcha_turnstile_response: "token-2" })
})

test("should block native submits until Turnstile returns a token", async () => {
  await renderCaptcha()
  expect(screen.getByTestId("native-blocked")).toHaveTextContent("true")

  act(() => turnstile.onSuccess("token-1"))
  expect(screen.getByTestId("native-blocked")).toHaveTextContent("false")

  act(() => turnstile.onExpire())
  expect(screen.getByTestId("native-blocked")).toHaveTextContent("true")
})

test("should allow native submits after a Turnstile client error", async () => {
  await renderCaptcha()

  act(() => turnstile.onError("110200"))

  expect(screen.getByTestId("native-blocked")).toHaveTextContent("false")
})

test("should block native submits again after a submit used the token", async () => {
  await renderCaptcha()
  act(() => turnstile.onSuccess("token-1"))

  await act(() => submit())

  expect(screen.getByTestId("native-blocked")).toHaveTextContent("true")
  act(() => turnstile.onSuccess("token-2"))
  expect(screen.getByTestId("native-blocked")).toHaveTextContent("false")
})
