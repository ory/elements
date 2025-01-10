// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  getNodeLabel,
  instanceOfUiText,
  UiNode,
} from "@ory/client-fetch"
import {
  messageTestId,
  OryNodeLabelProps,
  uiTextToFormattedMessage,
  useComponents,
  useOryFlow,
} from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"

function findResendNode(nodes: UiNode[]) {
  return nodes.find(
    (n) =>
      "name" in n.attributes &&
      ((n.attributes.name === "email" && n.attributes.type === "submit") ||
        n.attributes.name === "resend"),
  )
}

export function DefaultLabel({
  node,
  children,
  attributes,
  ...rest
}: OryNodeLabelProps) {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { Message } = useComponents()
  const { config, flowType, flow, initFlowUrl } = useOryFlow()
  const { setValue, formState } = useFormContext()

  const isPassword = attributes.type === "password"

  const resendNode = findResendNode(flow.ui.nodes)

  const handleResend = () => {
    if (resendNode?.attributes && "name" in resendNode.attributes) {
      setValue(resendNode.attributes.name, resendNode.attributes.value)
    }
  }

  const fieldError = formState.errors[attributes.name]

  return (
    <div className="flex flex-col gap-1 antialiased">
      {label && (
        <span className="inline-flex justify-between">
          <label
            {...messageTestId(label)}
            className="leading-normal text-input-foreground-primary"
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
                href={initFlowUrl(FlowType.Recovery)}
                className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
              >
                {intl.formatMessage({
                  id: "forms.label.forgot-password",
                  defaultMessage: "Forgot password?",
                })}
              </a>
            )}
          {resendNode?.attributes.node_type === "input" && (
            <button
              type="submit"
              name={resendNode.attributes.name}
              value={resendNode.attributes.value}
              onClick={handleResend}
              className="cursor-pointer text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
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
      {fieldError && instanceOfUiText(fieldError) && (
        <Message.Content message={fieldError} />
      )}
    </div>
  )
}
