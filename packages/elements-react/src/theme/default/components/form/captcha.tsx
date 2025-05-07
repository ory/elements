// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes } from "@ory/client-fetch"
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile"
import { useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { DefaultInput } from "./input"
import { OryNodeCaptchaProps } from "@ory/elements-react"

type Config = {
  sitekey: string
  action: string
  theme: "auto" | "light" | "dark"
  response_field_name: string
}

export const DefaultCaptcha = ({ node }: OryNodeCaptchaProps) => {
  const { setValue, formState } = useFormContext()
  const ref = useRef<TurnstileInstance>()
  // In this node, we only care about the `captcha-turnstile-options` node as that contains
  // all required information to render the captcha.

  const prevSubmitCount = useRef(formState.submitCount)

  // Reset widget whenever submitCount changes (this covers both successful submissions and validation errors)
  useEffect(() => {
    if (
      formState.submitCount > prevSubmitCount.current &&
      formState.isSubmitSuccessful
    ) {
      prevSubmitCount.current = formState.submitCount

      // Adding a small timeout to ensure the form submission process has completed
      setTimeout(() => {
        if (ref.current) {
          ref.current.reset()
        }
      }, 100)
    }
  }, [formState.submitCount, formState.isSubmitSuccessful])

  if (!isUiNodeInputAttributes(node.attributes)) {
    return null
  }

  if (node.attributes.name === "transient_payload.captcha_turnstile_response") {
    // This is the hidden field that gets populated.
    return <DefaultInput key={1} node={node} attributes={node.attributes} />
  } else if (node.attributes.name === "captcha_turnstile_options") {
    // This is the actual widget
    const options: Config = JSON.parse(node.attributes.value as string)
    return (
      <Turnstile
        ref={ref}
        siteKey={options.sitekey}
        options={{
          action: options.action,
          size: "flexible",
          theme: options.theme,
          responseField: false,
          responseFieldName: options.response_field_name,
        }}
        onExpire={() => ref.current?.reset()}
        onSuccess={(token) => {
          setValue(options.response_field_name, token)
        }}
      />
    )
  }

  return null
}
