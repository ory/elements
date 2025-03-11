// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes } from "@ory/client-fetch"
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile"
import { ReactElement, useRef } from "react"
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
  const { setValue } = useFormContext()
  const ref = useRef<TurnstileInstance>()
  // In this node, we only care about the `captcha-turnstile-options` node as that contains
  // all required information to render the captcha.
  const nodes: ReactElement[] = []

  // Special case for CAPTCHA handling as we need to render a different component
  if (isUiNodeInputAttributes(node.attributes)) {
    if (
      node.attributes.name === "transient_payload.captcha_turnstile_response"
    ) {
      nodes.push(
        <DefaultInput key={1} node={node} attributes={node.attributes} />,
      )
    }
  }

  if (
    isUiNodeInputAttributes(node.attributes) &&
    node.attributes.name === "captcha_turnstile_options"
  ) {
    const options: Config = JSON.parse(node.attributes.value as string)
    nodes.push(
      <Turnstile
        key={2}
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
      />,
    )
  }

  return nodes
}
