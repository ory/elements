// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { cn } from "../../utils/cn"
import { formatMessage, HeadlessFormProps } from "@ory/elements-react"
import { HeadlessMessageProps } from "@ory/elements-react"
import { useIntl } from "react-intl"

export function DefaultFormContainer({
  children,
  onSubmit,
  action,
  method,
}: PropsWithChildren<HeadlessFormProps>) {
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
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null
  }

  return <section className="text-left">{children}</section>
}

export function DefaultMessage({ message }: HeadlessMessageProps) {
  const intl = useIntl()
  return (
    <span
      className={cn("text-sm mt-1 leading-normal", {
        "text-forms-fg-error": message.type === "error",
        "text-forms-fg-default": message.type === "info",
        "text-forms-fg-success": message.type === "success",
      })}
    >
      {formatMessage(message, intl)}
    </span>
  )
}
