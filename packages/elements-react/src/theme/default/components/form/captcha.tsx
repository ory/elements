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

export const DefaultCaptcha = ({ node }: OryNodeCaptchaProps) => {
  const { Message } = useComponents()
  const intl = useIntl()
  const { setValue } = useFormContext()
  const { dispatchFormState, formState } = useOryFlow()
  const ref = useRef<TurnstileInstance>()
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
            console.error("Cloudflare Turnstile Error:", error)
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
