// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeLabelProps,
  messageTestId,
  uiTextToFormattedMessage,
  useComponents,
  useOryFlow,
} from "@ory/elements-react"
import { useIntl } from "react-intl"

export function DefaultLabel({
  node,
  children,
  attributes,
  ...rest
}: OryNodeLabelProps) {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { Message } = useComponents()
  const { config, flowType, flow } = useOryFlow()

  const isPassword = attributes.type === "password"

  const hasResendNode = flow.ui.nodes.some(
    (n) =>
      "name" in n.attributes &&
      n.attributes.name === "email" &&
      n.attributes.type === "submit",
  )

  return (
    <div className="flex flex-col antialiased gap-1">
      {label && (
        <span className="inline-flex justify-between">
          <label
            {...messageTestId(label)}
            className="text-sm font-medium leading-normal"
            htmlFor={attributes.name}
            {...rest}
          >
            {uiTextToFormattedMessage(label, intl)}
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
          {hasResendNode && (
            <button
              type="submit"
              name="method"
              value="code"
              className="text-links-link-default hover:underline hover:text-link-hover transition-colors text-sm font-medium cursor-pointer"
            >
              {intl.formatMessage({ id: "identities.messages.1070008" })}
            </button>
          )}
        </span>
      )}
      {children}
      {node.messages.map((message) => (
        <Message.Content key={message.id} message={message} />
      ))}
    </div>
  )
}
