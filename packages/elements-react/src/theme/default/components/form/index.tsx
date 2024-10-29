// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { cn } from "../../utils/cn"
import { useIntl } from "react-intl"
import {
  OryFormRootProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import { OryMessageContentProps } from "@ory/elements-react"
import { FlowType } from "@ory/client-fetch"

export function DefaultFormContainer({
  children,
  onSubmit,
  action,
  method,
}: PropsWithChildren<OryFormRootProps>) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      action={action}
      method={method}
      className={"grid gap-8"}
    >
      {children}
    </form>
  )
}

export function DefaultMessageContainer({ children }: PropsWithChildren) {
  const { flowType } = useOryFlow()
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null
  }

  return (
    <section
      className={cn(
        flowType === FlowType.Settings ? "text-center" : "text-left",
      )}
    >
      {children}
    </section>
  )
}

export function DefaultMessage({ message }: OryMessageContentProps) {
  const intl = useIntl()
  return (
    <span
      className={cn("text-sm mt-1 leading-normal", {
        "text-forms-fg-error": message.type === "error",
        "text-forms-fg-default": message.type === "info",
        "text-forms-fg-success": message.type === "success",
      })}
    >
      {uiTextToFormattedMessage(message, intl)}
    </span>
  )
}
