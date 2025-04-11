// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { cn } from "../../utils/cn"
import { useIntl } from "react-intl"
import {
  messageTestId,
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
  "data-testid": dataTestId,
}: PropsWithChildren<OryFormRootProps>) {
  return (
    <form
      data-testid={dataTestId}
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
      className={cn(
        "leading-normal",
        message.type === "error" &&
          "text-interface-foreground-validation-danger",
        message.type === "info" &&
          "text-interface-foreground-default-secondary",
        message.type === "success" &&
          "text-interface-foreground-validation-success",
      )}
      {...messageTestId(message)}
    >
      {uiTextToFormattedMessage(message, intl)}
    </span>
  )
}

export { DefaultButtonSocial } from "./social"
