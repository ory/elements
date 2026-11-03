// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile"
import { isUiNodeInputAttributes, UiText } from "@ory/client-fetch"
import {
  OryNodeCaptchaProps,
  OrySubmitGateResult,
  useComponents,
  useOryBlockNativeSubmit,
  useOryFlow,
  useOrySubmitGate,
} from "@ory/elements-react"
import { useEffect, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { useFormContext } from "react-hook-form"
import { cn } from "../../utils/cn"
import { useIntl } from "react-intl"

type Config = {
  sitekey: string
  action: string
  theme: "auto" | "light" | "dark"
  response_field_name: string
}

/**
 * Reads the CSP nonce the current document is enforcing against, so the
 * Turnstile script tag is admitted by nonce rather than by host.
 *
 * Under a `'strict-dynamic'` policy, host sources in `script-src` are ignored
 * entirely, so allow-listing the Turnstile host has no effect. The tag is
 * otherwise admitted only by trust propagation from the script that injected
 * it, which is a property of the runtime insertion path rather than of the
 * policy, and therefore not something to rely on.
 *
 * The nonce is read from the document rather than accepted as a prop because a
 * host that mints a nonce per request — as the Ory Account Experience proxy
 * does — will hand out a different value on later requests than the one the
 * document is enforcing against.
 *
 * Returns `undefined` during server rendering and when no nonce is in use, in
 * which case the script tag is emitted without one, as before.
 */
function documentCspNonce(): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }
  // The nonce content attribute is masked after parsing to close a CSS-based
  // exfiltration channel, so the IDL property is the only readable source.
  return (
    document.querySelector<HTMLScriptElement>("script[nonce]")?.nonce ||
    undefined
  )
}

const tokenWaitTimeoutMs = 30_000

type WidgetState = {
  token?: string
  isChallengeShowing: boolean
  hasFailed: boolean
}

function TurnstileCaptcha({ options }: { options: Config }) {
  const { Message } = useComponents()
  const intl = useIntl()
  const { setValue } = useFormContext()
  const { formState } = useOryFlow()
  const ref = useRef<TurnstileInstance>(null)
  const [isInteractive, setInteractive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<UiText | undefined>()
  const widget = useRef<WidgetState>({
    isChallengeShowing: false,
    hasFailed: false,
  })
  const [isTokenUsed, setTokenUsed] = useState(false)
  const [canSubmitNatively, setCanSubmitNatively] = useState(false)
  const settleWait = useRef<(result: OrySubmitGateResult) => void>(undefined)

  const markFailed = () => {
    widget.current.hasFailed = true
    setCanSubmitNatively(true)
    setErrorMessage({
      id: 5000000,
      text: intl.formatMessage({
        id: "captcha.error",
        defaultMessage:
          "Security verification failed. Please try again later. If the problem persists, contact support.",
      }),
      type: "error",
    })
  }

  const takeToken = (): OrySubmitGateResult => {
    const token = widget.current.token
    widget.current.token = undefined
    setTokenUsed(true)
    return token
      ? { proceed: true, values: { [options.response_field_name]: token } }
      : { proceed: true }
  }

  const endWait = (result: OrySubmitGateResult) => {
    const settle = settleWait.current
    settleWait.current = undefined
    settle?.(result)
  }

  useOrySubmitGate(() => {
    if (widget.current.token || widget.current.hasFailed) {
      return takeToken()
    }
    if (widget.current.isChallengeShowing) {
      return { proceed: false }
    }
    endWait({ proceed: false })
    return new Promise<OrySubmitGateResult>((resolve) => {
      const timeout = setTimeout(() => {
        markFailed()
        endWait({ proceed: false })
      }, tokenWaitTimeoutMs)
      settleWait.current = (result) => {
        clearTimeout(timeout)
        resolve(result)
      }
    })
  })

  useEffect(() => {
    if (!isTokenUsed || formState.isSubmitting) {
      return
    }
    // Ory accepts each token once, so the next submit needs a fresh one.
    setTokenUsed(false)
    setCanSubmitNatively(false)
    widget.current = { isChallengeShowing: false, hasFailed: false }
    setValue(options.response_field_name, "")
    ref.current?.reset()
  }, [
    isTokenUsed,
    formState.isSubmitting,
    options.response_field_name,
    setValue,
  ])

  useEffect(() => () => endWait({ proceed: false }), [])

  useOryBlockNativeSubmit(!canSubmitNatively)

  return (
    <>
      <Turnstile
        ref={ref}
        siteKey={options.sitekey}
        scriptOptions={{ nonce: documentCspNonce() }}
        options={{
          action: options.action,
          size: "flexible",
          theme: options.theme,
          responseField: true,
          responseFieldName: options.response_field_name,
          appearance: "interaction-only",
        }}
        className={cn("!block !h-[65px] !w-full !min-w-[300px]", {
          "!hidden": !isInteractive,
        })}
        onBeforeInteractive={() => {
          setInteractive(true)
          widget.current.isChallengeShowing = true
          endWait({ proceed: false })
        }}
        onExpire={() => {
          widget.current.token = undefined
          setCanSubmitNatively(false)
          setValue(options.response_field_name, "")
          ref.current?.reset()
          endWait({ proceed: false })
        }}
        onSuccess={(token) => {
          setValue(options.response_field_name, token)
          setErrorMessage(undefined)
          setCanSubmitNatively(true)
          widget.current = {
            ...widget.current,
            token,
            isChallengeShowing: false,
            hasFailed: false,
          }
          if (settleWait.current) {
            endWait(takeToken())
          }
        }}
        onError={(error) => {
          console.error(
            "[@ory/elements-react] Cloudflare Turnstile Error:",
            error,
          )
          markFailed()
          endWait({ proceed: false })
        }}
      />
      {errorMessage && (
        <Message.Content key={errorMessage.id} message={errorMessage} />
      )}
    </>
  )
}

export const DefaultCaptcha = ({ node }: OryNodeCaptchaProps) => {
  if (
    !isUiNodeInputAttributes(node.attributes) ||
    node.attributes.name !== "captcha_turnstile_options"
  ) {
    return null
  }

  const options: Config = JSON.parse(node.attributes.value as string)
  return <TurnstileCaptcha options={options} />
}
