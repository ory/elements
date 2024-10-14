// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, getNodeLabel } from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { useOryFlow } from "@ory/elements-react"
import { HeadlessLabelProps } from "@ory/elements-react"
import { formatMessage, messageTestId } from "@ory/elements-react"
import { cn } from "../../utils/cn"

export function DefaultLabel({
  node,
  children,
  attributes,
  ...rest
}: HeadlessLabelProps) {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { config, flowType } = useOryFlow()

  const isPassword = attributes.type === "password"

  const isCode = attributes.name === "code"

  return (
    <span className="flex flex-col antialiased gap-1">
      {label && (
        <span className="inline-flex justify-between">
          <label
            {...messageTestId(label)}
            className="text-sm font-medium leading-normal"
            htmlFor={attributes.name}
            {...rest}
          >
            {formatMessage(label, intl)}
          </label>
          {isPassword &&
            config.project.recovery_enabled &&
            flowType === FlowType.Login && (
              // TODO: make it possible to override with a custom component
              <a
                href={config.project.recovery_ui_url}
                className="text-links-link-default hover:underline hover:text-link-hover transition-colors text-sm font-medium"
              >
                {intl.formatMessage({
                  id: "forms.label.forgot-password",
                  defaultMessage: "Forgot password?",
                })}
              </a>
            )}
          {isCode && (
            <input
              type="submit"
              value="Resend Code"
              className="text-links-link-default hover:underline hover:text-link-hover transition-colors text-sm font-medium cursor-pointer"
            />
          )}
        </span>
      )}
      {children}
      {node.messages.map((message) => (
        <span
          key={message.id}
          className={cn("text-sm leading-normal", {
            "text-forms-fg-error": message.type === "error",
            "text-forms-fg-default": message.type === "info",
            "text-forms-fg-success": message.type === "success",
          })}
          {...messageTestId(message)}
        >
          {formatMessage(message, intl)}
        </span>
      ))}
    </span>
  )
}
