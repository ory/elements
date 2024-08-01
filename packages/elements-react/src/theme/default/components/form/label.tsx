import { FlowType, getNodeLabel } from "@ory/client-fetch"
import Link from "next/link"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"
import { HeadlessLabelProps } from "../../../../types"
import { useOryFlow } from "../../../../context"
import { formatMessage, messageTestId } from "../../../../util"

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

  return (
    <label className="flex flex-col antialiased gap-1" {...rest}>
      {label && (
        <span className="inline-flex justify-between">
          <span
            {...messageTestId(label)}
            className="text-sm font-medium leading-normal capitalize"
          >
            {formatMessage(label, intl)}
          </span>
          {isPassword &&
            config.project.recoveryEnabled &&
            flowType === FlowType.Login && (
              <Link
                href="/recovery"
                className="text-links-link-default hover:underline hover:text-link-hover transition-colors text-sm font-medium"
              >
                {intl.formatMessage({
                  id: "forms.label.forgot-password",
                  defaultMessage: "Forgot password?",
                })}
              </Link>
            )}
        </span>
      )}
      {children}
      {node.messages.map((message) => (
        <span
          key={message.id}
          className={cn("text-sm leading-normal capitalize", {
            "text-forms-fg-error": message.type === "error",
            "text-forms-fg-default": message.type === "info",
            "text-forms-fg-success": message.type === "success",
          })}
          {...messageTestId(message)}
        >
          {formatMessage(message, intl)}
        </span>
      ))}
    </label>
  )
}
