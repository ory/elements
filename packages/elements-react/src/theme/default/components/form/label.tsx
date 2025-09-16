// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  getNodeLabel,
  instanceOfUiText,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import {
  messageTestId,
  OryNodeLabelProps,
  uiTextToFormattedMessage,
  useComponents,
  useOryConfiguration,
  useOryFlow,
} from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { initFlowUrl } from "../../utils/url"
import { useMemo } from "react"

function findResendNode(nodes: UiNode[]) {
  return nodes.find(
    (n) =>
      "name" in n.attributes &&
      ((["email", "recovery_confirm_address"].includes(n.attributes.name) &&
        n.attributes.type === "submit") ||
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
  const { flow } = useOryFlow()
  const { setValue, formState } = useFormContext()

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
            data-testid={`ory/form/node/input/label/${attributes.name}`}
            {...rest}
          >
            {uiTextToFormattedMessage(label, intl)}
          </label>
          <LabelAction attributes={attributes} />
          {resendNode?.attributes.node_type === "input" && (
            <button
              type="submit"
              name={resendNode.attributes.name}
              value={resendNode.attributes.value}
              onClick={handleResend}
              className="cursor-pointer text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
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

type LabelActionProps = {
  attributes: UiNodeInputAttributes
}

function LabelAction({ attributes }: LabelActionProps) {
  const intl = useIntl()
  const { flowType, flow, formState } = useOryFlow()
  const config = useOryConfiguration()

  const action = useMemo(() => {
    if (flowType === FlowType.Login && config.project.recovery_enabled) {
      if (formState.current === "provide_identifier" && !flow.refresh) {
        if (attributes.name === "identifier") {
          return {
            message: intl.formatMessage({
              id: "forms.label.recover-account",
              defaultMessage: "Recover Account",
            }),
            href: initFlowUrl(config.sdk.url, "recovery", flow),
            testId: "recover-account",
          }
        }
      } else if (attributes.type === "password") {
        return {
          message: intl.formatMessage({
            id: "forms.label.forgot-password",
            defaultMessage: "Forgot password?",
          }),
          href: initFlowUrl(config.sdk.url, "recovery", flow),
          testId: "forgot-password",
        }
      }
    }
  }, [
    attributes,
    config.project.recovery_enabled,
    flow,
    flowType,
    intl,
    config.sdk.url,
    formState,
  ])

  return action ? (
    <a
      href={action.href}
      className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
      data-testid={`ory/screen/login/action/${action.testId}`}
    >
      {action.message}
    </a>
  ) : null
}
