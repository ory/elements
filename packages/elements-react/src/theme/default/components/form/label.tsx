// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  getNodeLabel,
  instanceOfUiText,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import {
  messageTestId,
  OryNodeLabelProps,
  useComponents,
  useOryConfiguration,
  useOryFlow,
  useResendCode,
} from "@ory/elements-react"
import { useMemo } from "react"
import { useIntl } from "react-intl"
import { resolveLabel } from "../../../../util/nodes"
import { initFlowUrl } from "../../utils/url"
import { kratosMessages } from "../../../../util/i18n/generated/kratosMessages"

export function DefaultLabel({
  node,
  children,
  attributes,
  fieldError,
}: OryNodeLabelProps) {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { Message } = useComponents()
  const { resendCode, resendCodeNode } = useResendCode()

  return (
    <div className="flex flex-col gap-1 antialiased">
      {label && (
        <span className="inline-flex justify-between">
          <label
            {...messageTestId(label)}
            className="leading-normal text-input-foreground-primary"
            htmlFor={attributes.name}
            data-testid={`ory/form/node/input/label/${attributes.name}`}
          >
            {resolveLabel(label, intl)}
          </label>
          <LabelAction attributes={attributes} />
          {resendCodeNode?.attributes.node_type === "input" && (
            <button
              type="button"
              name={resendCodeNode.attributes.name}
              value={resendCodeNode.attributes.value}
              onClick={resendCode}
              className="cursor-pointer text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            >
              {intl.formatMessage(kratosMessages[1070008])}
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
    if (
      flowType === FlowType.Login &&
      config.project.recovery_enabled &&
      !flow.refresh
    ) {
      if (formState.current === "provide_identifier") {
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
            defaultMessage: "Forgot Password?",
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
