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

/**
 * The default form container for Ory Elements.
 *
 * @param props - The properties for the DefaultFormContainer component.
 * @returns
 * @group Components
 * @category Default Components
 */
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

/**
 * The default message container for Ory Elements.
 *
 * @param props - The properties for the DefaultMessageContainer component.
 * @returns
 * @group Components
 * @category Default Components
 */
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

/**
 * The default message component for Ory Elements.
 *
 * @param props - The properties for the DefaultMessage component.
 * @returns
 * @group Components
 * @category Default Components
 * @see {@link @ory/elements-react!uiTextToFormattedMessage}
 */
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

export { DefaultButtonSocial } from "./sso"
