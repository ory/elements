// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile"
import { isUiNodeInputAttributes, UiText } from "@ory/client-fetch"
import {
  OryNodeCaptchaProps,
  useComponents,
  useOryFlow,
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

export const DefaultCaptcha = ({ node }: OryNodeCaptchaProps) => {
  const { Message } = useComponents()
  const intl = useIntl()
  const { setValue } = useFormContext()
  const { dispatchFormState, formState } = useOryFlow()
  const ref = useRef<TurnstileInstance>(null)
  const [isInteractive, setInteractive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<UiText | undefined>()
  // In this node, we only care about the `captcha-turnstile-options` node as that contains
  // all required information to render the captcha.

  // Reset widget whenever form is done submitting
  useEffect(() => {
    if (!formState.isSubmitting) {
      dispatchFormState({
        type: "form_input_loading",
        group: "captcha",
      })
      // Adding a small timeout to ensure the form submission process has completed
      setTimeout(() => {
        if (ref.current) {
          ref.current.reset()
        }
      }, 100)
    }
  }, [formState.isSubmitting, dispatchFormState])

  useEffect(() => {
    dispatchFormState({
      type: "form_input_loading",
      group: "captcha",
    })
  }, [dispatchFormState])

  if (!isUiNodeInputAttributes(node.attributes)) {
    return null
  }

  if (node.attributes.name === "transient_payload.captcha_turnstile_response") {
    // This is the hidden field that gets populated.
    return null
  } else if (node.attributes.name === "captcha_turnstile_options") {
    // This is the actual widget
    const options: Config = JSON.parse(node.attributes.value as string)

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
            dispatchFormState({
              type: "form_input_ready",
              input: "captcha",
            })
          }}
          onExpire={() => {
            ref.current?.reset()
            dispatchFormState({
              type: "form_input_loading",
              group: "captcha",
            })
          }}
          onSuccess={(token) => {
            setValue(options.response_field_name, token)
            dispatchFormState({
              type: "form_input_ready",
              input: "captcha",
            })
          }}
          onError={(error) => {
            console.error(
              "[@ory/elements-react] Cloudflare Turnstile Error:",
              error,
            )
            setErrorMessage({
              id: 5000000,
              text: intl.formatMessage({
                id: "captcha.error",
                defaultMessage:
                  "Security verification failed. Please try again later. If the problem persists, contact support.",
              }),
              type: "error",
            })
          }}
        />
        {errorMessage && (
          <Message.Content key={errorMessage.id} message={errorMessage} />
        )}
      </>
    )
  }

  return null
}
